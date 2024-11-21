import React, { useState } from 'react';
import '../styles/Feedback_Overlay.css';

const Feedback_Overlay = ({ message, show, onClose, onSubmitFeedback }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

    if (!show) return null;

    const handleRating = (star) => setRating(star);

    const handleSubmit = () => {
        onSubmitFeedback({
            comment,         
            rating,         
        });

        setComment('');
        setRating(0);
        onClose();
    };

    return (
        <div className="feedback-overlay">
            <div className="feedback-overlay-content">
                <button className="fb_close-button" onClick={onClose}>×</button>
                <h2>Feedback</h2>
                <textarea
                    placeholder={message}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="feedback-textarea"
                />
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={star <= rating ? 'star selected' : 'star'}
                            onClick={() => handleRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <button className="submit-button-feedback" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default Feedback_Overlay;
