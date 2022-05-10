package org.pickwicksoft.innovedu;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.pickwicksoft.innovedu.InnoveduApp;
import org.pickwicksoft.innovedu.config.TestSecurityConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { InnoveduApp.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
