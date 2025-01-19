# globeMapper

# NewsMapper

NewsMapper is an interactive news app which scrapes world events and places them geographically on a map. Instead of browsing news from a list, you can see exactly where events are occurring.

## How to Use

1. Create a MongoDB database called `globeMapper` with a collection called `events`.

2. Run the Spring Boot application (backend folder):
   ```bash
   mvn spring-boot:run
   ```

3. Navigate to the frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install react-scripts @google/generative-ai @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
   ```

4. Run the frontend React application:
   ```bash
   npm start
   ```

5. Open a browser and go to `localhost:3000`

6. Explore and enjoy the app!

<img width="1433" alt="image" src="https://github.com/user-attachments/assets/08c24c8d-9464-45f5-92e8-8f838d251448" />
