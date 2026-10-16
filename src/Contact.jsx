import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaLeaf, FaTimes } from "react-icons/fa";
import "./Contact.css";

const formspreeEndpoint = "https://formspree.io/f/xbgdqpaq";

function Contact() {
  const dialogRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (status !== "success") return;
    const timeout = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(timeout);
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = data.get("message").trim();

    if (!message) {
      event.currentTarget.elements.message.setCustomValidity("Add a little note first.");
      event.currentTarget.elements.message.reportValidity();
      return;
    }

    data.set("message", message);
    data.set("subject", "A little note from Silent Forest");
    setStatus("sending");
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error("Message could not be sent");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className={`contact-note${collapsed ? " contact-note-collapsed" : ""}`}>
        <button
        type="button"
        className="contact-invite"
        aria-label="Open contact form"
        title="questions or concerns, shoot me an email"
        onClick={() => dialogRef.current.showModal()}
        aria-haspopup="dialog"
        aria-controls="contact-dialog"
      >
        <FaEnvelope aria-hidden="true" />
        {!collapsed && (
          <span>
            <span className="contact-invite-question">Questions or concerns,</span>
            <span className="contact-invite-action">Shoot me an email!</span>
          </span>
        )}
        </button>
        {!collapsed && (
          <button
            type="button"
            className="contact-collapse"
            aria-label="Collapse contact note"
            onClick={() => setCollapsed(true)}
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
      </div>

      <dialog
        id="contact-dialog"
        ref={dialogRef}
        className="contact-dialog"
        aria-labelledby="contact-title"
        aria-describedby="contact-description"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right ||
                event.clientY < bounds.top || event.clientY > bounds.bottom) {
              dialogRef.current.close();
            }
          }
        }}
      >
        <button
          type="button"
          className="contact-close"
          aria-label="Close contact form"
          onClick={() => dialogRef.current.close()}
        >
          <FaTimes aria-hidden="true" />
        </button>
        <div className="contact-leaf" aria-hidden="true"><FaLeaf /></div>
        <h2 id="contact-title">Forest Mail</h2>
        <p id="contact-description">Questions, suggestions, or just a hello?<br />Leave a little note for me!</p>
        <form action={formspreeEndpoint} method="POST" onSubmit={handleSubmit} aria-busy={status === "sending"}>
          <label htmlFor="contact-name">Your name <span>(optional)</span></label>
          <input id="contact-name" name="name" autoComplete="name" maxLength={100} placeholder="A forest friend" />
          <label htmlFor="contact-email">Your email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="So I can write back" />
          <label htmlFor="contact-message">Your little note</label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            maxLength={3000}
            required
            placeholder="Hello from my corner of the woods…"
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
          <button type="submit" className="contact-send" disabled={status === "sending"}>
            <FaEnvelope aria-hidden="true" />
            {status === "success" ? "Your note is sent!" : status === "sending" ? "Sending your little note…" : "Let’s send a little mail"}
          </button>
          <p className="contact-hint" role="status">
            {status === "success" ? "Thank you! I'll get back to you soon!" :
              status === "error" ? "Your note couldn’t be sent. Please try again." : "A little note, from the Silent Forest to my inbox."}
          </p>
        </form>
      </dialog>
    </>
  );
}

export default Contact;
