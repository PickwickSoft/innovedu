package org.pickwicksoft.innovedu.repository;

import org.pickwicksoft.innovedu.domain.Content;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepository extends JpaRepository<Content, Long> {}
