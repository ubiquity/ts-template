function showLoading(show: boolean): void {
  const loadingEl = document.getElementById("loading");
  if (loadingEl) {
    const command = show ? "add" : "remove";
    loadingEl.classList[command]("overlay");
  }
}

export { showLoading };
