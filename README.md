# NewsMapper

NewsMapper is an interactive news app which scrapes world events and places them geographically on a map. Instead of browsing news from a list, you can see exactly where events are occurring.

## How to Use

1. Create a MongoDB database called `globeMapper` with a collection called `events`.

2. Populate the database be modifying the GlobeMapperApplication in the Java main folder: uncomment `e.saveWeeks(1)` and change to the amount of weeks you want from the past. Then run `e.saveWeeks(1)` daily to get daily news into the database.

3. Run the Spring Boot application (backend folder):
   ```bash
   mvn spring-boot:run
   ```

4. Navigate to the frontend folder and install dependencies:
   ```bash
   cd globemapperfrontend
   npm install react-scripts @google/generative-ai @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
   ```

5. Run the frontend React application:
   ```bash
   npm start
   ```

6. Open a browser and go to `localhost:3000`

7. Explore and enjoy the app!

<img width="1433" alt="image" src="https://github.com/user-attachments/assets/08c24c8d-9464-45f5-92e8-8f838d251448" />
