package com.univille.AccessControl;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:access-control-context-test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"JWT_SECRET=context-test-signing-secret-with-at-least-32-bytes",
		"ADMIN_FIXED_PASSWORD=context-test-only-admin-password"
})
class AccessControlApplicationTests {

	@Test
	void contextLoads() {
	}

}
