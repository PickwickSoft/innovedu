package org.pickwicksoft.innovedu.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "content")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    private String projectSectionTitle;

    @NotNull
    private String projectSectionDescription;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectSectionTitle() {
        return projectSectionTitle;
    }

    public void setProjectSectionTitle(String projectSectionTitle) {
        this.projectSectionTitle = projectSectionTitle;
    }

    public String getProjectSectionDescription() {
        return projectSectionDescription;
    }

    public void setProjectSectionDescription(String projectSectionDescription) {
        this.projectSectionDescription = projectSectionDescription;
    }
}
