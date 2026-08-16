const STYLES = `
.twg-modal-overlay {
	position: fixed;
	inset: 0;
	z-index: 10000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	background: rgba(5, 8, 12, 0.62);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.22s ease, visibility 0.22s ease;
}

.twg-modal-overlay.open {
	opacity: 1;
	visibility: visible;
}

.twg-modal {
	width: min(400px, 100%);
	background: var(--surface, #12151d);
	border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
	border-radius: 22px;
	padding: 28px 26px 24px;
	text-align: center;
	box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.75);
	transform: translateY(10px) scale(0.97);
	transition: transform 0.22s ease;
}

.twg-modal-overlay.open .twg-modal {
	transform: none;
}

.twg-modal-icon {
	width: 46px;
	height: 46px;
	margin: 0 auto 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: var(--accent, #34d399);
	color: var(--accent-ink, #052e22);
	box-shadow: 0 0 22px -4px var(--accent-border, rgba(52, 211, 153, 0.45));
}

.twg-modal-icon svg {
	width: 24px;
	height: 24px;
}

.twg-modal-icon[data-type="info"] {
	background: #38bdf8;
	color: #062033;
	box-shadow: 0 0 22px -4px rgba(56, 189, 248, 0.5);
}

.twg-modal-icon[data-type="error"] {
	background: var(--danger, #f87171);
	color: #2a0707;
	box-shadow: 0 0 22px -4px rgba(248, 113, 113, 0.5);
}

.twg-modal-title {
	font-size: 18px;
	font-weight: 700;
	letter-spacing: -0.01em;
	color: var(--text, #eef1f6);
	margin-bottom: 8px;
}

.twg-modal-body {
	font-size: 14px;
	line-height: 1.55;
	color: var(--text-muted, #8a92a6);
	word-break: break-word;
}

.twg-modal-list {
	list-style: none;
	margin: 0;
	padding: 4px 0;
	max-height: 40vh;
	overflow-y: auto;
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	justify-content: center;
}

.twg-modal-list li {
	font-size: 13px;
	font-weight: 600;
	color: var(--text, #eef1f6);
	background: var(--surface-2, #181c26);
	border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
	border-radius: 100px;
	padding: 6px 13px;
}

.twg-modal-actions {
	display: flex;
	gap: 10px;
	margin-top: 20px;
}

.twg-modal-btn {
	flex: 1;
	min-width: 0;
	background: var(--accent, #34d399);
	color: var(--accent-ink, #052e22);
	font-family: inherit;
	font-size: 14px;
	font-weight: 700;
	border: 1px solid transparent;
	border-radius: 12px;
	padding: 12px 16px;
	cursor: pointer;
	transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}

.twg-modal-btn:hover {
	background: #2fcb92;
	transform: translateY(-1px);
}

.twg-modal-btn:active {
	transform: translateY(0);
}

.twg-modal-btn-secondary {
	background: var(--surface-2, #181c26);
	color: var(--text, #eef1f6);
	border-color: var(--border, rgba(255, 255, 255, 0.1));
}

.twg-modal-btn-secondary:hover {
	background: #1d2331;
	border-color: var(--border-strong, rgba(255, 255, 255, 0.16));
}

.twg-modal-btn-danger {
	background: var(--danger, #f87171);
	color: #2a0707;
	box-shadow: 0 10px 26px -12px rgba(248, 113, 113, 0.5);
}

.twg-modal-btn-danger:hover {
	background: #fca5a5;
}

.twg-modal-btn:focus-visible {
	outline: 2px solid var(--accent-border, rgba(52, 211, 153, 0.45));
	outline-offset: 2px;
}

@media (max-width: 480px) {
	.twg-modal {
		padding: 24px 20px 20px;
	}
}
`;

const ICONS = {
	info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
	success:
		'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
	error:
		'<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
	list: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
};

let overlay = null;
let resolveClose = null;

function injectStyles() {
	if (document.getElementById('twg-modal-styles')) return;
	const style = document.createElement('style');
	style.id = 'twg-modal-styles';
	style.textContent = STYLES;
	document.head.appendChild(style);
}

function ensureOverlay() {
	if (overlay) return overlay;

	injectStyles();
	overlay = document.createElement('div');
	overlay.className = 'twg-modal-overlay';
	overlay.innerHTML = `
		<div class="twg-modal" role="dialog" aria-modal="true" aria-labelledby="twg-modal-title">
			<div class="twg-modal-icon" data-type="info"></div>
			<h2 class="twg-modal-title" id="twg-modal-title"></h2>
			<div class="twg-modal-body"></div>
			<div class="twg-modal-actions"></div>
		</div>`;
	document.body.appendChild(overlay);

	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) close(false);
	});
	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && overlay.classList.contains('open')) close(false);
	});

	return overlay;
}

function close(result) {
	const ov = ensureOverlay();
	ov.classList.remove('open');
	setTimeout(() => {
		ov.style.display = 'none';
		const resolve = resolveClose;
		resolveClose = null;
		if (resolve) resolve(result);
	}, 220);
}

/**
 * Open a centered modal dialog.
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.message]
 * @param {'info'|'success'|'error'|'list'} [options.type]
 * @param {string[]} [options.items] - renders as chips instead of a message
 * @param {Array<{label: string, variant?: 'primary'|'secondary'|'danger', value?: *}>} [options.buttons]
 * @returns {Promise<*>} resolves with the clicked button's value when the dialog is closed
 */
function openModal({
	title = '',
	message = '',
	type = 'info',
	items = null,
	buttons = [{ label: 'Got it', variant: 'primary' }],
} = {}) {
	const ov = ensureOverlay();

	ov.querySelector('.twg-modal-icon').dataset.type = type;
	ov.querySelector('.twg-modal-icon').innerHTML = ICONS[type] || ICONS.info;
	ov.querySelector('.twg-modal-title').textContent = title;

	const body = ov.querySelector('.twg-modal-body');
	body.innerHTML = '';
	if (items && items.length) {
		const ul = document.createElement('ul');
		ul.className = 'twg-modal-list';
		for (const item of items) {
			const li = document.createElement('li');
			li.textContent = item;
			ul.appendChild(li);
		}
		body.appendChild(ul);
	} else {
		body.textContent = message;
	}

	const actions = ov.querySelector('.twg-modal-actions');
	actions.innerHTML = '';
	for (const button of buttons) {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = `twg-modal-btn twg-modal-btn-${button.variant || 'primary'}`;
		btn.textContent = button.label;
		btn.addEventListener('click', () => close(button.value));
		actions.appendChild(btn);
	}

	ov.style.display = 'flex';
	requestAnimationFrame(() => ov.classList.add('open'));
	actions.querySelector('.twg-modal-btn').focus();

	return new Promise((resolve) => {
		resolveClose = resolve;
	});
}

/**
 * Show a centered modal dialog.
 * @param {object} options
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {'info'|'success'|'error'|'list'} [options.type]
 * @param {string[]} [options.items] - renders as chips instead of a message
 * @param {string} [options.buttonText]
 * @returns {Promise<void>} resolves when the dialog is closed
 */
export function showAlert({
	title = '',
	message = '',
	type = 'info',
	items = null,
	buttonText = 'Got it',
} = {}) {
	return openModal({ title, message, type, items, buttons: [{ label: buttonText, variant: 'primary' }] });
}

/**
 * Show a two-step confirmation dialog.
 * @param {object} options
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {string} [options.confirmText] - label of the destructive action
 * @param {string} [options.cancelText]
 * @returns {Promise<boolean>} resolves true if confirmed, false otherwise
 */
export function showConfirm({
	title = 'Are you sure?',
	message = '',
	confirmText = 'Confirm',
	cancelText = 'Cancel',
} = {}) {
	return openModal({
		title,
		message,
		type: 'error',
		buttons: [
			{ label: cancelText, variant: 'secondary', value: false },
			{ label: confirmText, variant: 'danger', value: true },
		],
	});
}
