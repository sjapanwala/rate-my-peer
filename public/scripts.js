// script.js - Main search page script
let students = [];

// Initial load of student directory
fetch('../data/directory.json')
  .then(response => response.json())
  .then(data => {
    students = data;
  })
  .catch(error => console.error('Error fetching student data:', error));

function searchStudents() {
  const query = document.getElementById('search').value.toLowerCase();
  const resultsDiv = document.getElementById('results');
  
  if (query === "") {
    resultsDiv.style.display = "none";
    return;
  }

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(query)
  );
  
  if (filteredStudents.length > 0) {
    resultsDiv.style.display = "block";
    displayResults(filteredStudents);
  } else {
    resultsDiv.style.display = "none";
  }
}

function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  
  results.forEach(student => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.textContent = student.name + ' - ' + student.institution;
    resultItem.onclick = () => navigateToProfile(student.path);
    resultsDiv.appendChild(resultItem);
  });
}

function navigateToProfile(path) {
  // Store the path in sessionStorage for the profile page to access
  sessionStorage.setItem('studentProfilePath', path);
  // Navigate to the profile page
  window.location.href = 'profiles/profile.html';
}

// profile.js - Profile page script
function loadProfile() {
  // Get the stored path from sessionStorage
  const profilePath = sessionStorage.getItem('studentProfilePath');
  console.log(profilePath);
  
  if (!profilePath) {
    console.error('No profile path found');
    return;
  }

  fetch(profilePath)
    .then(response => response.json())
    .then(data => {
      const student = data.student;

      // Basic Information
      if (document.getElementById('profile-picture')) {
        document.getElementById('profile-picture').src = student.profile_picture;
      }
      updateElement('name', student.name);
      updateElement('student-ccid', student.student_ccid);
      updateElement('major', student.major);
      updateElement('minor', student.minor);
      updateElement('gpa', student.gpa);

      // External Links
      const externalLinksContainer = document.getElementById('external-links');
      if (externalLinksContainer && student.external_links && student.external_links[0]) {
        const links = student.external_links[0];
        Object.keys(links).forEach(key => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = links[key];
          a.textContent = key.charAt(0).toUpperCase() + key.slice(1);
          a.target = "_blank";
          li.appendChild(a);
          externalLinksContainer.appendChild(li);
        });
      }

      // Institution Information
      if (student.institution_information) {
        updateElement('institution-name', student.institution_information.institution_name);
        updateElement('start-date', student.institution_information.start_date);
        updateElement('graduation-date', student.institution_information.expected_graduation_date);
        updateElement('graduated', student.institution_information.graduated ? 'Yes' : 'No');
      }

      // Course History
      const coursesContainer = document.getElementById('courses');
      if (coursesContainer && student.course_history) {
        student.course_history.forEach(course => {
          const courseDiv = document.createElement('div');
          courseDiv.innerHTML = `
            <p><strong>Course:</strong> ${course.course_name} (${course.course_code})</p>
            <p><strong>Semester:</strong> ${course.semester}</p>
            <p><strong>Grade:</strong> ${course.grade}</p>
          `;
          if (course.lab) {
            courseDiv.innerHTML += `
              <p><strong>Lab Section:</strong> ${course.lab.lab_section}</p>
              <p><strong>Collaborators:</strong> ${course.lab.collaborators.join(', ')}</p>
              <p><strong>Peer Rating:</strong> ${course.lab.peer_rating}</p>
              <p><strong>Comments:</strong> ${course.lab.peer_comments.join(' | ')}</p>
            `;
          }
          coursesContainer.appendChild(courseDiv);
        });
      }

      // Club Activities
      const clubsContainer = document.getElementById('club-activities');
      if (clubsContainer && student.clubs) {
        student.clubs.forEach(club => {
          const clubDiv = document.createElement('div');
          clubDiv.innerHTML = `
            <p><strong>Activity:</strong> ${club.activity_name}</p>
            <p><strong>Position:</strong> ${club.position}</p>
            <p><strong>Years Active:</strong> ${club.years_active}</p>
          `;
          clubsContainer.appendChild(clubDiv);
        });
      }
    })
    .catch(error => console.error('Error fetching profile data:', error));
}

// Helper function to safely update element content
function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

// Check if we're on the profile page and load the profile if we are
if (window.location.pathname.includes('profiles/profile.html')) {
  loadProfile();
}