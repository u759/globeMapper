package com.example.globeMapper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.ApplicationContext;

import java.io.IOException;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
public class GlobeMapperApplication {

	public static void main(String[] args) throws IOException {
		ApplicationContext context = SpringApplication.run(GlobeMapperApplication.class, args);

		EventController e = context.getBean(EventController.class);

		//e.saveWeeks(1);

	}

}
