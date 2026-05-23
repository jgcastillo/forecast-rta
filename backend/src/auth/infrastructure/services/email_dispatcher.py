import os
import smtplib
from email.mime.text import MIMEText
from loguru import logger

class EmailDispatcher:
    """Infrastructure adapter to handle email dispatching via SMTP or local log fallback."""
    
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST")
        try:
            self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        except (TypeError, ValueError):
            self.smtp_port = 587
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("SMTP_FROM_EMAIL", "noreply@rta.com")
        
    def send_temporary_password(self, to_email: str, temporary_password: str) -> bool:
        """Send email containing the temporary password. Falls back to console log if SMTP settings are missing."""
        subject = "Welcome to Forecast RTA - Your Account is Ready"
        body = (
            f"Hello,\n\n"
            f"Your account has been successfully created by the Administrator.\n\n"
            f"Temporary Password: {temporary_password}\n\n"
            f"Please log in and update your password immediately.\n\n"
            f"Best regards,\n"
            f"Forecast RTA Team"
        )
        
        # Fallback for dev/testing when SMTP parameters are not set
        if not self.smtp_host or not self.smtp_username:
            masked_body = body.replace(temporary_password, "********")
            logger.info(
                f"[SIMULATION] Email sent to: {to_email}\n"
                f"Subject: {subject}\n"
                f"Body:\n{masked_body}"
            )
            return True
            
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to_email
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)
                server.sendmail(self.from_email, [to_email], msg.as_string())
                
            logger.info(f"Temporary password email successfully dispatched to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to dispatch temporary password email to {to_email}: {str(e)}")
            return False
