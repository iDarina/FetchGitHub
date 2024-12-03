// DOM Elements
const searchButton = document.getElementById('searchButton');
const usernameInput = document.getElementById('username');
const profileDiv = document.getElementById('profile');
const reposDiv = document.getElementById('repos');

// Event Listener for Search Button
searchButton.addEventListener('click', async () => {
  const username = usernameInput.value.trim(); // Get the entered username

  // Clear previous results
  profileDiv.innerHTML = '';
  reposDiv.innerHTML = '';

  if (username) {
    // Fetch user data
    const userData = await fetchUserProfile(username);
    const userRepos = await fetchUserRepos(username);

    // Display user profile if data is found
    if (userData) {
      displayUserProfile(userData);
    } else {
      profileDiv.innerHTML = `<p class="text-danger">User not found!</p>`;
    }

    // Display repositories if data is found
    if (userRepos) {
      displayUserRepos(userRepos);
    }
  } else {
    alert('Please enter a username!');
  }
});

// Fetch User Profile Data
async function fetchUserProfile(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.ok) {
      return response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Fetch User Repositories
async function fetchUserRepos(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=5`);
    if (response.ok) {
      return response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    return null;
  }
}

// Display User Profile
function displayUserProfile(user) {
  profileDiv.innerHTML = `
    <div class="profile-info text-center">
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="rounded-circle" style="width: 150px; height: 150px;">
      <h3>${user.name || 'No name provided'}</h3>
      <p><strong>Website:</strong> <a href="${user.blog}" target="_blank">${user.blog || 'N/A'}</a></p>
      <p><strong>Location:</strong> ${user.location || 'N/A'}</p>
      <p><strong>Member Since:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
      <a href="${user.html_url}" target="_blank" class="btn btn-primary">View Profile</a>
    </div>
  `;
}

// Display User Repositories
function displayUserRepos(repos) {
  reposDiv.innerHTML = `
    <h3>Latest Repos</h3>
    <ul class="list-group">
      ${repos
        .map(
          (repo) => `
          <li class="list-group-item">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </li>
        `
        )
        .join('')}
    </ul>
  `;
}
