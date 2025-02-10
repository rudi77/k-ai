import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path
from app.core.config import settings

def setup_logging():
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure logging format
    log_format = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_format)
    root_logger.addHandler(console_handler)
    
    # File handler (rotating)
    file_handler = RotatingFileHandler(
        filename=log_dir / "app.log",
        maxBytes=10485760,  # 10MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setFormatter(log_format)
    root_logger.addHandler(file_handler)
    
    # Set logging levels for third-party libraries
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("fastapi").setLevel(logging.INFO)
    
    return root_logger 