package org.pickwicksoft.innovedu.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Project.
 */
@Entity
@Table(name = "project")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Project implements Serializable, UserAssignable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @Size(min = 3)
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Size(min = 3)
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "approved", nullable = false)
    private Boolean approved = false;

    @Column(name = "date")
    private ZonedDateTime date = ZonedDateTime.now();

    @ManyToOne
    private User user;

    @ManyToOne
    private Topic topic;

    @OneToMany(mappedBy = "project", fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "user" })
    @JsonManagedReference
    private List<Star> stars;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Project id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Project title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Project description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getApproved() {
        return this.approved;
    }

    public Project approved(Boolean approved) {
        this.setApproved(approved);
        return this;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Project date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Project user(User user) {
        this.setUser(user);
        return this;
    }

    public Topic getTopic() {
        return this.topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public Project topic(Topic topic) {
        this.setTopic(topic);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Project)) {
            return false;
        }
        return id != null && id.equals(((Project) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", approved='" + getApproved() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }

    public List<Star> getStars() {
        return stars;
    }

    public void setStars(List<Star> stars) {
        this.stars = stars;
    }
}
