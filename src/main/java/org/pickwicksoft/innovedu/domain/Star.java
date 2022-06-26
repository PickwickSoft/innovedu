package org.pickwicksoft.innovedu.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "star")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Star implements UserAssignable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne
    @JsonIgnoreProperties(value = { "user", "topic" }, allowSetters = true)
    private Project project;

    @OneToOne
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Star{" + "id=" + id + ", project=" + project + ", user=" + user + '}';
    }
}
