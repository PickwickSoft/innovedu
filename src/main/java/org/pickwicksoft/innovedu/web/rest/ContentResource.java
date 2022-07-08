package org.pickwicksoft.innovedu.web.rest;

import java.util.List;
import java.util.Objects;
import javax.validation.Valid;
import org.pickwicksoft.innovedu.domain.Content;
import org.pickwicksoft.innovedu.repository.ContentRepository;
import org.pickwicksoft.innovedu.web.rest.errors.BadRequestAlertException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api")
@Transactional
public class ContentResource {

    private static final String ENTITY_NAME = "content";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContentRepository contentRepository;

    public ContentResource(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @GetMapping("/contents")
    public List<Content> getAllContents() {
        return contentRepository.findAll();
    }

    @PostMapping("/contents")
    public Content createContent(@Valid @RequestBody Content content) {
        contentRepository.deleteAll();
        return contentRepository.save(content);
    }

    @PutMapping("/contents/{id}")
    public ResponseEntity<Content> updateContent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Content content
    ) {
        if (content.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, content.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Content result = contentRepository.save(content);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
}
