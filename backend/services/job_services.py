import json
import os
import re
import requests
import random
from dotenv import load_dotenv

load_dotenv()

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "jobs.json")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

# Adzuna supported country codes and major city mapping
SUPPORTED_COUNTRIES = {
    "india": "in", "in": "in", "delhi": "in", "mumbai": "in", "bangalore": "in", "hyderabad": "in", "chennai": "in", "pune": "in",
    "usa": "us", "united states": "us", "us": "us", "new york": "us", "san francisco": "us", "chicago": "us", "los angeles": "us", "austin": "us", "seattle": "us",
    "uk": "gb", "united kingdom": "gb", "gb": "gb", "london": "gb", "manchester": "gb", "birmingham": "gb", "edinburgh": "gb",
    "germany": "de", "de": "de", "berlin": "de", "munich": "de", "hamburg": "de", "frankfurt": "de",
    "france": "fr", "fr": "fr", "paris": "fr", "lyon": "fr", "marseille": "fr",
    "australia": "au", "au": "au", "sydney": "au", "melbourne": "au", "brisbane": "au", "perth": "au",
    "canada": "ca", "ca": "ca", "toronto": "ca", "vancouver": "ca", "montreal": "ca", "ottawa": "ca",
    "brazil": "br", "br": "br", "sao paulo": "br", "rio de janeiro": "br",
    "south africa": "za", "za": "za", "cape town": "za", "johannesburg": "za",
    "poland": "pl", "pl": "pl", "warsaw": "pl", "krakow": "pl",
    "austria": "at", "at": "at", "vienna": "at",
    "new zealand": "nz", "nz": "nz", "auckland": "nz", "wellington": "nz",
    "netherlands": "nl", "nl": "nl", "amsterdam": "nl", "rotterdam": "nl",
    "singapore": "sg", "sg": "sg",
}

def load_local_jobs():
    """Load fallback job data from the local jobs.json file."""
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading local jobs: {e}")
        return []

def detect_country(location):
    if not location:
        return None # Return None for global search
    
    loc_lower = location.lower()
    for name, code in SUPPORTED_COUNTRIES.items():
        if name in loc_lower:
            return code
    return "in" # Default to India if location is provided but not recognized

def fetch_adzuna_jobs(query, location=None, country="in", results_per_page=10, is_internship=False):
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY or ADZUNA_APP_ID == "YOUR_ADZUNA_APP_ID":
        return []

    what = query
    if is_internship:
        what = f"{query} internship"

    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": results_per_page,
        "what": what,
        "content-type": "application/json"
    }
    
    if location and country != "global": # Only use 'where' if we have a specific country
        params["where"] = location

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        jobs = []
        for result in data.get("results", []):
            jobs.append({
                "id": result.get("id"),
                "company": result.get("company", {}).get("display_name", "Unknown"),
                "title": result.get("title"),
                "description": result.get("description"),
                "location": result.get("location", {}).get("display_name", "Remote/Varies"),
                "salary_min": result.get("salary_min"),
                "redirect_url": result.get("redirect_url"),
                "created": result.get("created"),
                "country_code": country
            })
        return jobs
    except Exception as e:
        print(f"Error fetching from Adzuna ({country}): {e}")
        return []

def get_jobs(query, location=None, is_internship=False):
    country = detect_country(location)
    
    all_jobs = []
    
    if country:
        # Single country search
        all_jobs = fetch_adzuna_jobs(query, location=location, country=country, is_internship=is_internship)
    else:
        # GLOBAL search: Fetch from major regions and merge
        regions = ["in", "us", "gb"]
        for r in regions:
            region_jobs = fetch_adzuna_jobs(query, location=None, country=r, results_per_page=5, is_internship=is_internship)
            all_jobs.extend(region_jobs)
        
        # Shuffle results to provide a global mix
        random.shuffle(all_jobs)

    if all_jobs:
        return all_jobs[:15] # Return top 15 results

    # Fallback to local matching if API fails or no keys
    local_jobs = load_local_jobs()
    results = []
    
    q = query.lower()
    loc = location.lower() if location else ""
    
    for job in local_jobs:
        title_lower = job["title"].lower()
        desc_lower = job.get("description", "").lower()
        job_loc_lower = job.get("location", "").lower()
        
        match_query = q in title_lower or q in desc_lower
        match_loc = not loc or loc in job_loc_lower
        
        # If both query and location are provided, both must match
        # If only location is provided, show all jobs in that location
        # If only query is provided, show matching jobs from all locations
        if loc and not q.strip():
            should_include = match_loc
        elif match_query and match_loc:
            should_include = True
        else:
            should_include = False
        
        if should_include:
            results.append({
                "id": job.get("id", job["title"]),
                "company": job.get("company", "Company X"),
                "title": job["title"],
                "description": job.get("description", ""),
                "location": job.get("location", "Remote"),
                "salary_min": None,
                "redirect_url": job.get("redirect_url", "#"),
                "status": "Applied" if is_internship else "Available"
            })
    
    return results[:15]

