package com.example.globeMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class DailyTaskScheduler {

    private final EventController eventController;

    @Autowired
    public DailyTaskScheduler(EventController eventController) {
        this.eventController = eventController;
    }

    // Runs at midnight every day
    @Scheduled(cron = "0 0 0 * * *")
    public void executeDailyTask() throws IOException {
        eventController.saveWeeks(1);
    }
}
