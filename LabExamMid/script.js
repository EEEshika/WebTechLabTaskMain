

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.comment-section');

    sections.forEach(section => {
        const comments = [];
        let currentRating = 0;

        const totalCommentsEl = section.querySelector('.total-comments');
        const averageRatingEl = section.querySelector('.average-rating');
        const form = section.querySelector('.commentForm');
        const nameInput = form.querySelector('.name');
        const emailInput = form.querySelector('.email');
        const commentInput = form.querySelector('.comment-text');
        const nameError = form.querySelector('.name-error');
        const emailError = form.querySelector('.email-error');
        const commentError = form.querySelector('.comment-error');
        const stars = form.querySelectorAll('.star');
        const ratingValueEl = form.querySelector('.rating-value');
        const commentsList = section.querySelector('.comments-list');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-value'));
                updateStarRatingUI();
            });
            star.addEventListener('mouseover', () => {
                const v = parseInt(star.getAttribute('data-value'));
                highlightStars(v);
            });
            star.addEventListener('mouseout', () => {
                updateStarRatingUI();
            });
        });

        function highlightStars(value) {
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= value);
            });
        }

        function updateStarRatingUI() {
            stars.forEach(s => {
                const v = parseInt(s.getAttribute('data-value'));
                s.classList.toggle('active', v <= currentRating);
            });
            ratingValueEl.textContent = currentRating > 0 ? `${currentRating} out of 5 stars` : 'No rating selected';
        }

        function validateForm() {
            let isValid = true;
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const comment = commentInput.value.trim();

            if (name.length < 2 || name.length > 50) {
                nameError.style.display = 'block';
                isValid = false;
            } else {
                nameError.style.display = 'none';
            }

            if (email && !email.includes('@')) {
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailError.style.display = 'none';
            }

            if (comment.length < 10 || comment.length > 500) {
                commentError.style.display = 'block';
                isValid = false;
            } else {
                commentError.style.display = 'none';
            }

            return isValid;
        }

        function updateStatistics() {
            totalCommentsEl.textContent = comments.length;
            if (comments.length > 0) {
                const ratings = comments.filter(c => c.rating > 0).map(c => c.rating);
                averageRatingEl.textContent = ratings.length > 0
                    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                    : '0.0';
            } else {
                averageRatingEl.textContent = '0.0';
            }
        }

        function addComment(name, email, commentText, rating) {
            const newComment = {
                id: Date.now(),
                name,
                email,
                comment: commentText,
                rating,
                date: new Date().toLocaleString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                })
            };
            comments.unshift(newComment);
            renderComments();
            updateStatistics();
        }

        function renderComments() {
            if (comments.length === 0) {
                commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>';
                return;
            }

            commentsList.innerHTML = '';
            comments.forEach(c => {
                const commentEl = document.createElement('div');
                commentEl.className = 'comment';

                let ratingHtml = '';
                if (c.rating > 0) {
                    ratingHtml = `<div class="comment-rating">Rating: ${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</div>`;
                }

                commentEl.innerHTML = `
                    <div class="comment-header">
                        <div class="comment-author">${escapeHtml(c.name)}</div>
                        <div class="comment-date">${c.date}</div>
                    </div>
                    ${ratingHtml}
                    <div class="comment-content">${escapeHtml(c.comment)}</div>
                `;
                commentsList.appendChild(commentEl);
            });
        }

        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const commentText = commentInput.value.trim();
            addComment(name, email, commentText, currentRating);

            form.reset();
            currentRating = 0;
            updateStarRatingUI();
        });

        updateStatistics();
        renderComments();
        updateStarRatingUI();
    });
});
