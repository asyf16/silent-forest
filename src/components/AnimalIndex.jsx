import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import "../styling/AnimalIndex.css";

const animals = [
  { id: "littleKitty", name: "Little Kitty", icon: "/images/cat-icon.png", note: "A little shy and a little curious, Little Kitty is always the first to wander in." },
  { id: "misterBear", name: "Mister Bear", icon: "/images/bear-icon.png", note: "Mister Bear is a gentle soul who keeps the forest peaceful, one quiet moment at a time." },
  { id: "madameOwl", name: "Madame Owl", icon: "/images/owl-icon.png", note: "Wise and watchful, Madame Owl loves the quiet and has a soft spot for patient visitors." },
  { id: "bunny", name: "Shy Bunny", icon: "/images/bunny-icon.png", note: "First one ear peeks out, then the other. When the forest stays quiet, Shy Bunny hops a little closer." },
];

export default function AnimalIndex({ index }) {
  return (
    <>
      <button type="button" className="book-trigger" popovertarget="animal-index" aria-label="Open animal index" title="Animal index">
        <img src="/images/book.webp" alt="" />
      </button>
      <section id="animal-index" className="animal-index" popover="auto" aria-labelledby="animal-index-title">
        <header className="animal-index-heading">
          <button type="button" className="animal-index-close" popovertarget="animal-index" popovertargetaction="hide" aria-label="Close animal index"><FaTimes aria-hidden="true" /></button>
          <h2 id="animal-index-title">Animal index</h2>
          <p className="animal-index-footer">✧ Keep quiet. Let the forest come to you. ✧</p>

        </header>
        <div className="animal-index-entries" role="region" aria-label="Animal entries" tabIndex={0}>
          {animals.map((animal) => {
            const seenAt = index[animal.id];
            return (
              <article className={`animal-entry${seenAt ? "" : " animal-entry-unseen"}`} key={animal.name}>
                <span className="animal-portrait" aria-hidden="true">{seenAt ? <img src={animal.icon} alt="" /> : "?"}</span>
                <div>
                  <h3>{seenAt ? animal.name : "?"}</h3>
                  <p>{seenAt ? animal.note : "You have not discovered this animal yet."}</p>
                  {seenAt && <p className="animal-seen-at">Discovered at: {seenAt}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

AnimalIndex.propTypes = {
  index: PropTypes.shape({
    littleKitty: PropTypes.string,
    misterBear: PropTypes.string,
    madameOwl: PropTypes.string,
    bunny: PropTypes.string,
  }).isRequired,
};
