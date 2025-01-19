package com.example.globeMapper;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventRepository eventRepository;
    @GetMapping("/all")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public void saveAllEvents() throws IOException {
        downloadEvents();   //saves csv file to data folder

        String folderPath = "data"; // Replace with your folder path
        File folder = new File(folderPath);

        // Find the first CSV file in the folder
        File[] files = folder.listFiles((dir, name) -> name.endsWith(".CSV"));
        if (files == null || files.length == 0) {
            System.out.println("No CSV files found in the folder.");
            return;
        }
        File csvFile = files[0]; // Take the first CSV file found

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        List<Event> events = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] fields = line.split("\t");

                Event e = new Event();
                // Adjust indices based on the actual structure of the CSV
                e.setId(fields[0]);
                LocalDate date = LocalDate.parse(fields[1], dateFormatter); // Adjust format if needed
                e.setDate(date);
                String title = fields[0]; // Placeholder index
                e.setTitle(title);
                String description = fields[52]; // Placeholder index
                e.setDescription(description);
                String source = fields[fields.length - 1]; // URL field
                e.setSource(source);
                double latitude = fields[56].isEmpty() ? - 999 : Double.parseDouble(fields[56]);
                e.setLatitude(latitude);
                double longitude = fields[57].isEmpty() ? - 999 : Double.parseDouble(fields[57]);
                e.setLongitude(longitude);

                events.add(e);
                // Create a new Record and add to the list
            }
        } catch (IOException | NumberFormatException e) {
            e.printStackTrace();
        }

        eventRepository.saveAll(events);

    }
    private void downloadEvents() throws IOException {
        FileUtils.cleanDirectory(new File("data"));
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://data.gdeltproject.org/gdeltv2/lastupdate.txt";
        String lastUpdate = restTemplate.getForObject(url, String.class);
        String dlUrl = lastUpdate.substring(lastUpdate.indexOf("http"), lastUpdate.indexOf(".export.CSV.zip") + 15);

        try {
            try (BufferedInputStream in = new BufferedInputStream(new URL(dlUrl).openStream());
                 FileOutputStream fileOutputStream = new FileOutputStream("data/events.zip")) {
                byte dataBuffer[] = new byte[1024];
                int bytesRead;
                while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
                    fileOutputStream.write(dataBuffer, 0, bytesRead);
                }
            } catch (Exception e) {
                // handle exception
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String zipFilePath = "data/events.zip";
        String destDirectory = "data";

        File destDir = new File(destDirectory);
        if (!destDir.exists()) {
            destDir.mkdir();
        }
        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry entry = zipIn.getNextEntry();
            while (entry != null) {
                String filePath = destDirectory + File.separator + entry.getName();
                if (!entry.isDirectory()) {
                    extractFile(zipIn, filePath);
                } else {
                    File dir = new File(filePath);
                    dir.mkdir();
                }
                zipIn.closeEntry();
                entry = zipIn.getNextEntry();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void extractFile(ZipInputStream zipIn, String filePath) throws IOException {
        try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(filePath))) {
            byte[] bytesIn = new byte[4096];
            int read;
            while ((read = zipIn.read(bytesIn)) != -1) {
                bos.write(bytesIn, 0, read);
            }
        }
    }

}
