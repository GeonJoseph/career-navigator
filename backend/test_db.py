
import socket
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_port(host, port):
    print(f"Checking port {port} on {host}...")
    try:
        with socket.create_connection((host, port), timeout=5):
            print(f"Port {port} is OPEN")
            return True
    except socket.timeout:
        print(f"Port {port} is CLOSED (Timeout)")
    except Exception as e:
        print(f"Port {port} error: {e}")
    return False

def check_db_connection(url):
    print(f"Checking connection to: {url.split('@')[-1]}") # Don't print password
    try:
        conn = psycopg2.connect(url, connect_timeout=5)
        conn.close()
        print("Connection SUCCESSFUL")
        return True
    except Exception as e:
        print(f"Connection FAILED: {e}")
    return False

if __name__ == "__main__":
    host = "aws-1-ap-northeast-1.pooler.supabase.com"
    check_port(host, 5432)
    check_port(host, 6543)
    
    url = os.getenv("DATABASE_URL")
    if url:
        # Test original URL
        print("\nTesting original DATABASE_URL...")
        check_db_connection(url)
        
        # Test with port 6543
        if ":5432" in url:
            new_url = url.replace(":5432", ":6543")
            print(f"\nTesting with port 6543:")
            check_db_connection(new_url)
    else:
        print("DATABASE_URL not found in .env")
