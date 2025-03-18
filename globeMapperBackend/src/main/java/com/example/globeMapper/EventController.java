package com.example.globeMapper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.ZoneId;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import java.io.*;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    //eg: http://localhost:8080/api/events/within-week?date=20240909
    //date input-7 days
    @GetMapping("/within-week")
    public List<Event> getEventsWithinWeek(@RequestParam("date") String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate endDate = LocalDate.parse(date, formatter);
        LocalDate startDate = endDate.minusDays(7);
        return eventRepository.findByDateBetween(startDate, endDate);
    }

    //set weeks == 1 to download today, weeks == 2 to download the last 2 weeks, etc.
    public void saveWeeks(int weeks) throws IOException {

        for (int week = 0; week < weeks; week++) {

            downloadEvents(LocalDate.now().minusWeeks(week), weeks);

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
            List<Event> events = new CopyOnWriteArrayList<>();

            ExecutorService executor = Executors.newFixedThreadPool(100);

            try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] fields = line.split("\t");

                    Event e = new Event();
                    // Adjust indices based on the actual structure of the CSV
                    e.setId(fields[0]);
                    LocalDate date = LocalDate.parse(fields[1], dateFormatter); // Adjust format if needed
                    e.setDate(date);
                    String description = fields[52]; // Placeholder index
                    e.setDescription(description);
                    String source = fields[fields.length - 1]; // URL field
                    e.setSource(source);
                    double latitude = fields[56].isEmpty() ? -999 : Double.parseDouble(fields[56]);
                    e.setLatitude(latitude);
                    double longitude = fields[57].isEmpty() ? -999 : Double.parseDouble(fields[57]);
                    e.setLongitude(longitude);

                    Runnable task = () -> {
                        try {
                            Document doc = Jsoup.connect(source).get();
                            String title = doc.title();
                            String img = Objects.requireNonNull(doc.selectFirst("meta[property=og:image]")).attr("content");
                            e.setTitle(title);
                            e.setImg(img);
                            events.add(e);
                        } catch (Exception ex) {

                        }
                    };

                    executor.submit(task);
                }
            } catch (IOException | NumberFormatException e) {
                e.printStackTrace();
            }

            executor.shutdown();
            try {
                System.out.println(executor.awaitTermination(3600, TimeUnit.SECONDS)); // Adjust the timeout as needed
                System.out.println("Week " + week + " done.");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            eventRepository.saveAll(events);
        }
    }

    private void downloadEvents(LocalDate date, int weeks) throws IOException {
        FileUtils.cleanDirectory(new File("data"));

        String dlUrl;

        if (weeks == 1) {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://data.gdeltproject.org/gdeltv2/lastupdate.txt";
            String lastUpdate = restTemplate.getForObject(url, String.class);
            dlUrl = lastUpdate.substring(lastUpdate.indexOf("http"), lastUpdate.indexOf(".export.CSV.zip") + 15);
        } else {
            dlUrl = "http://data.gdeltproject.org/gdeltv2/" + DateTimeFormatter.ofPattern("yyyyMMdd").format(date) + "230000.export.CSV.zip";
        }


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
