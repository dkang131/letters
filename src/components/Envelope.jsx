import { useState } from 'react';
import './Envelope.css';

export default function EnvelopeTemplate() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const pages = [
    {
      title: 'Special Message',
      content:
        'This is the first page of your letter. You can put your introduction here.',
    },
    {
      title: 'A Little More',
      content:
        'This is the second page. Now you can continue your message without making one enormous letter.',
    },
    {
      title: 'Memories',
      content:
        'This is the third page. You can use this page for memories, stories, or something meaningful.',
    },
    {
      title: 'Looking Forward',
      content:
        'This is the fourth page. Write about the things you are looking forward to.',
    },
    {
      title: 'One More Thing',
      content:
        'This is the fifth page. Save something special here that deserves its own page.',
    },
    {
      title: 'The End',
      content:
        'This is the final page of the letter. Thank you for reading all six pages.',
    },
  ];

  const sendFeedback = async () => {
    if (!feedback.trim()) return;

    setSending(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      setFeedback('');
      setSent(true);
      setTimeout(() => {
            setSent(false);
        }, 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const toggleEnvelope = () => {
    setIsOpen((open) => !open);

    if (isOpen) {
      setCurrentPage(0);
    }
  };

  const nextPage = (event) => {
    event.stopPropagation();

    setCurrentPage((page) =>
      Math.min(page + 1, pages.length - 1)
    );
  };

  const previousPage = (event) => {
    event.stopPropagation();

    setCurrentPage((page) =>
      Math.max(page - 1, 0)
    );
  };

  return (
    <div className="envelope-container">

        <div
        className={`envelope ${isOpen ? 'open' : ''}`}
        onClick={toggleEnvelope}
        >
        <div className="flap"></div>

        <div className="flap-badge">
            Click Here
        </div>

        <div className="pocket"></div>

        <div className="letter">
            <div className="letter-page">
            <h2>{pages[currentPage].title}</h2>

            <p>{pages[currentPage].content}</p>
            </div>

            <div className="letter-navigation">
            <button
                onClick={previousPage}
                disabled={currentPage === 0}
            >
                ← Previous
            </button>

            <span className="page-number">
                {currentPage + 1} / {pages.length}
            </span>

            <button
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
            >
                Next →
            </button>
            </div>
        </div>
        </div>


        {/* =========================
            FEEDBACK
        ========================= */}

        {isOpen && currentPage === pages.length - 1 && (
        <div
            className="feedback-section"
            onClick={(event) => event.stopPropagation()}
        >
            <h3>Leave a message</h3>

            <textarea
                value={feedback}
                onChange={(event) => {
                    setFeedback(event.target.value);
                    setSent(false);
                }}
                placeholder="Write something here..."
                rows={4}
            />

            <button
            onClick={sendFeedback}
            disabled={sending || !feedback.trim()}
            >
            {sending ? 'Sending...' : 'Send Message'}
            </button>

            {sent && (
            <p className="feedback-success">
                Message sent ❤️
            </p>
            )}
        </div>
        )}

    </div>
    );
}