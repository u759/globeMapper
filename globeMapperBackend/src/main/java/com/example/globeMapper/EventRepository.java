package com.example.globeMapper;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    // Custom query methods can be added here if needed
    List<Event> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
