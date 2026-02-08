Transforming a frontend course project into a robust Full-Stack application using Supabase & React 🚀

I’m excited to share my latest project, WorldWise! 🌍✈️

Initially, this started as a learning project from Jonas Schmedtmann’s React course. However, I wanted to push the boundaries and turn it into a fully functional, production-ready application.

Instead of sticking to the original curriculum's "fake backend" (json-server), I re-architected the app to handle real-world data and user sessions.

🚀 Key Upgrades & Technical Challenges:
🔹 From Mock to Real Backend: Replaced the local JSON server with Supabase (PostgreSQL), making the app accessible from anywhere, not just localhost. 
🔹 Authentication & Security: Implemented real user authentication using Supabase Auth. I utilized Row Level Security (RLS) to ensure users can only access their own private travel data (Data Isolation). 
🔹 Cloud Storage: Added a feature allowing users to upload trip photos directly to Supabase Storage Buckets, turning the map into a visual travel diary.
 🔹 Enhanced UX: Integrated a custom Geocoding Search bar using the Nominatim API, allowing users to search for cities instantly rather than manually navigating the map.

🛠️ Tech Stack: 
Frontend: React.js, React Router, Context API, CSS Modules.
Backend (BaaS): Supabase (PostgreSQL Database, Auth, Storage).
APIs: Leaflet (Maps), Nominatim (Geocoding/Search).

This project was a deep dive into connecting a modern React frontend with a BaaS (Backend-as-a-Service) solution.

Check it out live! 👇 
🔗 Live Demo: https://lnkd.in/dRhvWbQS
💻 GitHub Repo: https://lnkd.in/dpe35peG
