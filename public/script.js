function downloadFile(type) {
  const url = document.getElementById("videoUrl").value;
  if (!url) {
    alert("Please enter a YouTube URL!");
    return;
  }
  window.location.href = `/download/${type}?url=${encodeURIComponent(url)}`;
}
