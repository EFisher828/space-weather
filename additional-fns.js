// Define the URL of the directory listing
const directoryUrl = 'https://services.swpc.noaa.gov/images/animations/enlil/';

// Use the fetch API to fetch the directory listing
fetch(directoryUrl)
  .then((response) => {
    // Check if the response status is OK
    if (response.status === 200) {
      return response.text();
    } else {
      throw new Error('Failed to fetch directory listing');
    }
  })
  .then((htmlContent) => {
    // Parse the HTML content to extract file names
    const fileNames = extractFileNamesFromHTML(htmlContent);

    document.getElementById('dateSlider').max = fileNames.length - 1
    document.getElementById('dateSlider').value = fileNames.length - 1

    document.getElementById('dateSlider').addEventListener('input', function(event) {
      let endFrame = event.target.max
      let selectedFrame = event.target.value
      document.getElementById('enlil').src = 'https://services.swpc.noaa.gov/images/animations/enlil/' + fileNames[Number(selectedFrame)]
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// Function to extract file names from HTML content
function extractFileNamesFromHTML(htmlContent) {
  const fileNames = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const links = doc.querySelectorAll('a');

  for (const link of links) {
    // Extract file names from href attributes (skip directories and parent links)
    const href = link.getAttribute('href');
    if (!href.endsWith('/') && href !== '../') {
      fileNames.push(href);
    }
  }

  return fileNames;
}
