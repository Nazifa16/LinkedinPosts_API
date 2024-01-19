const postList = document.querySelector("#postList");
const postTitle = document.querySelector("#postTitle");
const postDesc = document.querySelector("#postDesc");
const postBtn = document.querySelector("#postBtn");
const loadingSpinner = document.querySelector("#loadingSpinner");

let data = [];

// Function to fetch posts from the server
async function getPosts() {
  try {
    const response = await fetch("https://blog-api-t6u0.onrender.com/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

// Function to create a new post
async function createPost(form) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    };

    const response = await fetch(
      `https://blog-api-t6u0.onrender.com/posts`,
      options
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("error", err);
  }
}

// Function to update a post
async function uptPost(id, form) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  };

  const response = await fetch(
    `https://blog-api-t6u0.onrender.com/posts/${id}`,
    options
  );

  const data = await response.json();

  return data;
}

// Function to remove a post
async function rmvPost(id) {
  try {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      `https://blog-api-t6u0.onrender.com/posts/${id}`,
      options
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("err", err);
  }
}

// Function to render posts to the UI
function renderElements(data) {
  postList.innerHTML = data
    .map(
      (post) => `
      <!-- Post card element with a unique "data-id" attribute for identification : -->
      <div class="card" data-id="${post.id}">
        <img
          src="https://s3.amazonaws.com/thumbnails.venngage.com/template/64122fb7-b02b-4059-8569-fd9dd859a11d.png"
          class="card-img-top object-fit-cover"
          height="200"
          alt="..."
        />
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.body}</p>
          <button class="btn btn-info btn-sm" onclick="handleEdit(${post.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="handleRemoveEl(${post.id})">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

// Function to open the modal for editing a post
function openEditModal(id) {
  // Selecting the card body of the post with the specified id:
  const postDiv = document.querySelector(
    `#postList .card[data-id="${id}"] .card-body`
  );
  const postToEdit = data.find((post) => post.id === id);

  if (!postToEdit) {
    console.log("Post not found");
    return;
  }
  // Convert card content to input fields in the modal
  postDiv.innerHTML = `
    <input class="form-control mb-2" id="editedPostTitle" value="${postToEdit.title}" />
    <textarea class="form-control mb-2" id="editedPostDesc">${postToEdit.body}</textarea>
    <button class="btn btn-success btn-sm" onclick="saveEditedPost(${id})">Save</button>
    <button type="button" class="btn btn-secondary btn-sm" onclick="closeEditedPost()" data-bs-dismiss="modal">Close</button>
  `;
}

// Function to handle the edit button click
function handleEdit(id) {
  openEditModal(id);
}

// Function to save the edited post
async function saveEditedPost(id) {
  try {
    const editedTitle = document.querySelector("#editedPostTitle").value;
    const editedDesc = document.querySelector("#editedPostDesc").value;

    if (!editedTitle.trim() || !editedDesc.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Updated form data
    const updatedForm = {
      title: editedTitle,
      body: editedDesc,
    };

    // Update the post on the server
    const updatedPost = await uptPost(id, updatedForm);

    // Update data array with the edited post
    data = data.map((post) => (post.id === id ? updatedPost : post));
    console.log(data);

    // Render the updated data back to the UI
    renderElements(data);
  } catch (err) {
    console.log("err", err);
  }
}

// Function to close the modal
function closeEditedPost() {
  renderElements(data);
}

// Function to handle the removal of a post
async function handleRemoveEl(id) {
  try {
    // Remove the post from the server
    await rmvPost(id);

    // Filter out the deleted post from the data array
    data = data.filter((post) => post.id !== id);

    // Render the updated data back to the UI
    renderElements(data);
  } catch (err) {
    console.log("err", err);
  }
}

// Event listener for the create post button
postBtn.addEventListener("click", handleCreatePost);
// Function to handle the creation of a new post
async function handleCreatePost() {
  try {
    // Disable the button and show loading spinner during the request
    postBtn.setAttribute("disabled", "true");
    loadingSpinner.classList.remove("d-none");
    loadingSpinner.classList.add("d-block");

    // Get values from the input fields
    const title = postTitle.value;
    const body = postDesc.value;

    if (!title.trim() || !body.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Form data for creating a new post
    const form = {
      title,
      body,
    };

    // Create a new post on the server
    const newPost = await createPost(form);

    // Update the data array with the new post
    data = [newPost, ...data];

    // Render the updated data back to the UI
    renderElements(data);
  } catch (err) {
    console.log("err", err);
  } finally {
    // Enable the button and hide loading spinner after the request
    postBtn.removeAttribute("disabled");
    loadingSpinner.classList.add("d-none");
    loadingSpinner.classList.remove("d-block");
    postTitle.value = "";
    postDesc.value = "";
  }
}

// Initial function to fetch posts from the server
async function App() {
  try {
    // Fetch posts from the server
    const posts = await getPosts();

    // Update the data array with the fetched posts
    data = posts;
    console.log(data);

    // Render the posts to the UI
    renderElements(posts);
  } catch (err) {
    console.log("err", err);
  }
}
App();
