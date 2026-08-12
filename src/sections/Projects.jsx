import { PROJECTS } from "../data";
import ProjectPlate from "./ProjectPlate";
import { useProjectsRail } from "../motion/useProjectsRail";

/*
 * The work, as a row that runs sideways.
 *
 * The third beat, and the first dark screen on the page — `data-nav-dark` is
 * what tells the rail to invert its ink while this passes behind it, the same
 * mechanism the contact section uses.
 *
 * The cards do not fit across the screen and are not meant to: the section
 * holds still while the row travels, so coming down the page walks along the
 * work rather than past it. `useProjectsRail` owns that movement, because the
 * distance to travel is the row's overflow and can only be measured.
 */
export default function Projects() {
  useProjectsRail();

  return (
    <section className="projects" id="projects" data-nav-dark>
      <div className="wrap projects-head">
        <p
          className="projects-chip"
          data-tl-from="{'opacity': 0, 'y': 14}"
          data-tl-duration="0.7"
          data-tl-ease="power2.out"
        >
          Selected work
        </p>

        <div className="projects-headline">
          <h2
            className="projects-statement"
            data-tl-split="lines"
            data-tl-from="{'yPercent': 110}"
            data-tl-delay="0.1"
          >
            Built end to end,
            <br />
            shipped to real devices
          </h2>

          {/*
           * The intro sits beside the heading rather than under it, which is
           * what keeps the top of this screen from being one tall stack of
           * type — and it is the shape the reference uses.
           */}
          <div
            className="projects-intro"
            data-tl-from="{'opacity': 0, 'y': 22}"
            data-tl-duration="0.9"
            data-tl-ease="power3.out"
          >
            <p>
              Product work, front to back: interfaces taken from an empty
              repository to something running on a real device — on Android, on
              iOS, and in the browser.
            </p>
          </div>
        </div>
      </div>

      {/*
       * Two boxes, and both are load-bearing.
       *
       * `.projects-rail` is the runway: a tall, otherwise empty element whose
       * height is the scroll distance the row needs, written by the hook once it
       * knows how far the row has to travel. `.projects-view` sticks to the top
       * of the screen and clips, so while the runway passes under it the screen
       * holds still and only the track inside moves.
       *
       * Sticky rather than a ScrollTrigger pin, like the hero: a pin rewrites
       * the document with a spacer element, and this page already has enough
       * measured against the positions either side of this section.
       */}
      <div className="projects-rail">
        <div className="projects-view">
          <ol className="projects-track">
            {PROJECTS.map((project, i) => (
              <li className="project-card" key={project.id}>
                {/* Drawn cover by default; a real screenshot the moment one is
                    put on the entry, which is what belongs here in the end. */}
                {project.image ? (
                  <img
                    className="project-plate"
                    src={project.image}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <ProjectPlate className="project-plate" plate={project.plate} />
                )}

                <div className="project-top">
                  <span className="project-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ul className="project-tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-foot">
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-tagline">{project.tagline}</p>
                </div>

                {/* The whole card is the link, when there is one to make — a
                    card that is only partly clickable is a card people miss. */}
                {project.href && (
                  <a
                    className="project-hit"
                    href={project.href}
                    aria-label={project.name}
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
