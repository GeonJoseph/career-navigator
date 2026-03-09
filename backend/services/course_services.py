import random

def get_courses(query):
    # Expanded diverse course pool
    providers = [
        ("Coursera", "https://www.coursera.org/search?query="),
        ("Udemy", "https://www.udemy.com/courses/search/?q="),
        ("edX", "https://www.edx.org/search?q="),
        ("YouTube", "https://www.youtube.com/results?search_query="),
        ("LinkedIn Learning", "https://www.linkedin.com/learning/search?keywords="),
        ("Pluralsight", "https://www.pluralsight.com/search?q="),
        ("Khan Academy", "https://www.khanacademy.org/search?page_search_query="),
        ("MIT OpenCourseWare", "https://ocw.mit.edu/search/?q="),
        ("DataCamp", "https://www.datacamp.com/search?q="),
        ("Codecademy", "https://www.codecademy.com/search?query="),
        ("FreeCodeCamp", "https://www.freecodecamp.org/learn/search?q="),
        ("Coursera Project Network", "https://www.coursera.org/search?query=guided+project+"),
    ]
    
    categories = ["Technical", "Fundamental", "Expert", "Free", "Professional", "Academic", "Practical"]
    durations = ["2h", "5h", "10h", "20h", "40h", "Ongoing", "Self-paced"]
    
    q = query.strip() or "React"
    
    # Randomized result count to feel more dynamic (8 to 16)
    count = random.randint(8, 16)
    
    results = []
    # Generate varied recommendations
    for i in range(count):
        provider_name, base_url = random.choice(providers)
        cat = random.choice(categories)
        dur = random.choice(durations)
        rating = round(random.uniform(4.0, 4.9), 1)
        
        # Vary titles based on common patterns
        title_patterns = [
            f"{q} specialization",
            f"Complete {q} Bootcamp 2026",
            f"Advanced {q} concepts",
            f"{q} for Data Science",
            f"Building real-world projects with {q}",
            f"{q} fundamentals for beginners",
            f"Cracking the {q} interview",
            f"Architecture patterns in {q}",
            f"Introduction to {q}",
            f"Practical {q} guide",
            f"Mastering {q}: From Zero to Hero"
        ]
        title = random.choice(title_patterns)
        
        results.append({
            "title": title,
            "provider": provider_name,
            "duration": dur,
            "rating": rating,
            "category": cat,
            "url": f"{base_url}{q}"
        })
    
    # Shuffle to avoid same order every time
    random.shuffle(results)
        
    return results
