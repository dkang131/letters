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
          title: 'For Lauren',
          content:
          'I was starting to enjoy your company. All the subtle and little things and touch make me very much happy.'
      },
      {
          // title: 'A Little More',
          content:
          "Throughout the years. I learnt alot from the past. How I am not fitted in a different religious relationship. How hard when it's to even hold a meaningful conversation. How hard when I was not getting a meaningful feedback. How much I crave for a equality in education background and knowledge. How much I wanted to be somehow somewhat important to other. Finally, I learnt to love people how they understand",
      },
      {
          // title: 'Memories',
          content:
          "Slowly I found peace on you. I found myself letting you inside my safe bubble just like how I am able to let you fiddling with me without any uneasiness. It's just 'if it's you, then I am able to let you in'.",
      },
      {
          // title: 'Looking Forward',
          content:
          'I may not be good at my words like others. I tend to show my care through other actions than words. Deep down I really wanted to tell you that I liked you and your company so much already. How much I wanted to spend more time with you. How much I wanted to meet you. How much I just wanted to do things with you and include you in my routine.',
      },
      {
          // title: 'One More Thing',
          content:
          'I may not be the best version. I am aware that I have a lot to catch up. I may not yet be able to give you things that you wanted. But I want to catch up. I want to roll the dice for once and fight for what I think is worth and fight for what I wanted.',
      },
      {
          title: 'The End',
          content:
          'Last but not least. Lauren Meilani, are you willing to be part of my routine and let me be in yours as well until how much time left the world gave us? Because in this world full of fast food. I wanted to cook a porridge over small heat with you',
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