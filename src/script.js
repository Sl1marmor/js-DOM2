const API_URL = 'https://picsum.photos/v2/list';
const LIMIT = 4;

const gallery = document.getElementById('gallery');
const statusEl = document.getElementById('status');
const counterEl = document.getElementById('counter');

const loadBtn = document.getElementById('loadBtn');
const removeBtn = document.getElementById('removeBtn');
const reverseBtn = document.getElementById('reverseBtn');
const clearBtn = document.getElementById('clearBtn');

let page = 1;

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
}

function updateUI() {
  const count = gallery.children.length;
  counterEl.textContent = `Фото: ${count}`;
  removeBtn.disabled = count === 0;
  reverseBtn.disabled = count < 2;
  clearBtn.disabled = count === 0;
}

function createCard(photo) {
  const card = document.createElement('figure');
  card.className = 'card';
  card.dataset.id = photo.id;

  const img = document.createElement('img');
  img.src = `https://picsum.photos/id/${photo.id}/600/450`;
  img.alt = `Фото від ${photo.author}`;
  img.loading = 'lazy';

  const author = document.createElement('figcaption');
  author.className = 'author';
  author.textContent = photo.author;

  card.append(img, author);
  return card;
}

async function loadImages() {
  loadBtn.disabled = true;
  setStatus('Завантаження...');

  try {
    const response = await fetch(`${API_URL}?page=${page}&limit=${LIMIT}`);
    if (!response.ok) {
      throw new Error(`Помилка сервера: ${response.status}`);
    }

    const photos = await response.json();
    photos.forEach((photo) => gallery.append(createCard(photo)));

    page += 1;
    setStatus('');
  } catch (error) {
    setStatus('Не вдалося завантажити картинки. Перевірте інтернет і спробуйте ще раз.', true);
    console.error(error);
  } finally {
    loadBtn.disabled = false;
    updateUI();
  }
}

function clearGallery() {
  gallery.innerHTML = '';
  setStatus('Галерея порожня');
  updateUI();
}

function removeLast() {
  if (gallery.lastElementChild) {
    gallery.lastElementChild.remove();
  }
  updateUI();
}

function reverseGallery() {
  const cards = Array.from(gallery.children).reverse();
  gallery.append(...cards); // append переносить наявні елементи у новому порядку
}

loadBtn.addEventListener('click', loadImages);
clearBtn.addEventListener('click', clearGallery);
removeBtn.addEventListener('click', removeLast);
reverseBtn.addEventListener('click', reverseGallery);

loadImages();