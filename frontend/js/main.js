var playlists = [];
var selected_ID = null;
var playlistIndex = 0;
var urlCount = 1;

const tableBody = document.getElementById("playlists_table");

function clearTable() {
  tableBody.innerHTML = "";
}

function addToTable(jsonData) {
  jsonData.forEach((data) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = data.name;
    row.appendChild(nameCell);
    const creationCell = document.createElement("td");
    creationCell.textContent = data.created;
    row.appendChild(creationCell);
    const lastCell = document.createElement("td");
    lastCell.textContent = data.mp3Files.length;
    row.appendChild(lastCell);
    const actionCell = document.createElement("td");
    actionCell.innerHTML = `
  <span class="material-symbols-outlined" onclick="playPlaylist('${data.id}')">play_arrow</span>
  <span class="material-symbols-outlined" onclick="openEdit('${data.id}')">edit</span>
  <span class="material-symbols-outlined" onclick="openDelete('${data.id}')">delete</span>
  `;
    row.appendChild(actionCell);
    tableBody.appendChild(row);
  });
}

async function getPlaylists() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem("API_KEY"));
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const id = localStorage.getItem("ID");
  clearTable();
  await fetch(`http://68.183.119.179:3000/api/playlists?id=${id}`, requestOptions)
    .then(async (response) => {
      const jsonData = await response.json();
      playlists = jsonData;
      addToTable(jsonData);
    })
    .catch((error) => console.log("error", error));
}

function addUrlField(containerID, val = "") {
  const container = document.getElementById(containerID);
  const urlDiv = document.createElement("div");
  urlDiv.classList.add("form-group");
  urlDiv.innerHTML = `
        <input type="url" class="form-control w-75 d-inline"  name="url${urlCount}" value="${val}" required style="margin-top:1em">
        <button type="button" class="btn btn-danger d-inline"
        onclick="removeUrlField(this)"><span
                class="material-symbols-outlined" style='padding:0%'>delete</span></button>
      `;
  container.appendChild(urlDiv);
  urlCount++;
}

function removeUrlField(button) {
  const urlField = button.parentNode;
  urlField.parentNode.removeChild(urlField);
}

function openEdit(id) {
  selected_ID = id;
  const jsonData = playlists.filter(function (playlist) {
    return playlist.id === id;
  });
  const data = jsonData[0];
  $("#name_e").val(data.name);
  $("#urlsContainerEdit").html("");
  data.mp3Files.forEach((song, index) => {
    addUrlField("urlsContainerEdit", song);
  });
  $("#editModal").modal("toggle");
}

$("#editPlaylistForm").on("submit", async function (event) {
  $("#edit_loader").removeAttr("hidden");
  event.preventDefault();
  const formData = new FormData(this);
  const urls = [];
  Array.from($("#urlsContainerEdit input")).forEach((el) => {
    urls.push(el.value);
  });
  formData.append("music_urls", urls.join(";"));
  const userId = localStorage.getItem("ID");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem("API_KEY"));
  const reqStatus = await fetch(
    `http://127.0.0.1:3000/api/playlists/${selected_ID}?id=${userId}`,
    {
      method: "PATCH",
      headers: myHeaders,
      body: formData,
    }
  )
    .then(async (response) => {
      return response.status;
    })
    .catch((error) => {
      console.log(
        "There was a problem with the fetch operation:",
        error.message
      );
    });
  $("#messageModalTitle").html("Actualizado");
  if (reqStatus != 200) {
    $("#messageModalTitle").html("Ocurrió un problema");
  }
  $("#edit_loader").attr("hidden", true);
  $("#editModal").modal("toggle");
  $(".modal-backdrop").remove();
  $("#messageModal").modal("toggle");
});

function openDelete(id) {
  selected_ID = id;
  const jsonData = playlists.filter(function (playlist) {
    return playlist.id === id;
  });
  const data = jsonData[0];
  $("#delete_modal_content").html("Playlist: " + data.name);
  $("#deleteModal").modal("toggle");
  $("#delete_playlist_button").show();
}

async function deletePlaylist() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem("API_KEY"));
  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };
  var userId = localStorage.getItem("ID");
  await fetch(
    `http://127.0.0.1:3000/api/playlists/${selected_ID}?id=${userId}`,
    requestOptions
  )
    .then((response) => {
      $("#delete_modal_content").html("Eliminado");
      $("#delete_playlist_button").hide();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  await getPlaylists();
}

$("#newPlaylistForm").on("submit", async function (event) {
  event.preventDefault();
  $("#create_loader").removeAttr("hidden");
  const formData = new FormData(this);
  const userId = localStorage.getItem("ID");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem("API_KEY"));
  const reqStatus = await fetch(
    `http://127.0.0.1:3000/api/playlists/?id=${userId}`,
    {
      method: "POST",
      headers: myHeaders,
      body: formData,
    }
  )
    .then(async (response) => {
      return response.status;
    })
    .catch((error) => {
      console.log(
        "There was a problem with the fetch operation:",
        error.message
      );
    });
  $("#messageModalTitle").html("Creado");
  if (reqStatus != 201) {
    $("#messageModalTitle").html("Ocurrió un problema");
  }
  $("#create_loader").attr("hidden", true);
  $("#creationModal").modal("toggle");
  $(".modal-backdrop").remove();
  $("#messageModal").modal("toggle");
  await getPlaylists();
});

const audio = document.querySelector("audio");
const seekSlider = document.getElementById("seek-slider");
const currentTimeContainer = document.getElementById("current-time");

seekSlider.addEventListener("input", () => {
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
  $("#duration").html(calculateTime(audio.duration));
};

const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
};

if (audio.readyState > 0) {
  displayDuration();
  setSliderMax();
} else {
  audio.addEventListener("loadedmetadata", () => {
    displayDuration();
    setSliderMax();
  });
}
var playState = "play";
$("#play-icon").on("click", () => {
  if (playState === "play") {
    audio.play();
    $("#play-icon").html("pause");
    playState = "pause";
  } else {
    audio.pause();
    $("#play-icon").html("play_arrow");
    playState = "play";
  }
});
seekSlider.addEventListener("change", () => {
  audio.currentTime = seekSlider.value;
});
audio.addEventListener("timeupdate", () => {
  seekSlider.value = Math.floor(audio.currentTime);
  $("#current-time").html(calculateTime(seekSlider.value));
});

function playPlaylist(id) {
  const jsonData = playlists.filter(function (playlist) {
    return playlist.id === id;
  });
  const data = jsonData[0];
  playlist = data;
  $(".music_controller").removeClass("d-none");
  $("#active_playlist").html(`${data.name}:${playlistIndex}`);
  $("#playlist_img").attr("src", data.coverImage);
  $("#track").attr("src", data.mp3Files[playlistIndex]);
  audio.play();
  $("#play-icon").html("pause");
  playState = "pause";
}

async function logout() {
  const key = localStorage.getItem("ID");
  await fetch(`http://68.183.119.179:3000/api/auth/logout?id=${key}`, {
    method: "GET",
    redirect: "follow",
  });
  localStorage.removeItem("API_KEY");
  localStorage.removeItem("ID");
  window.location.href = "/login.html";
}

$(document).ready(async function () {
  checkAuth();
  await getPlaylists();

  $("#delete_playlist_button").on("click", async () => {
    deletePlaylist();
  });
  $("#logout").on("click", async () => {
    logout();
  });
  $("#searchForm").on("submit", async (event) => {
    event.preventDefault();
    const searchKey = $("#search_input").val();
    clearTable();
    if (!searchKey) {
      addToTable(playlists);
      return;
    }
    const filtered = playlists.filter((data) => data.name.includes(searchKey));
    addToTable(filtered);
  });
  $("#prev_icon").on("click", () => {
    playlistIndex--;
    console.log(playlistIndex);
    if (playlistIndex < 0) {
      playlistIndex = playlist.mp3Files.length - 1;
    }
    $("#track").attr("src", playlist.mp3Files[playlistIndex]);
    audio.play();
    $("#play-icon").html("pause");
    $("#active_playlist").html(`${playlist.name}:${playlistIndex}`);
    playState = "pause";
  });
  $("#next_icon").on("click", () => {
    playlistIndex++;
    console.log(playlistIndex);
    if (playlistIndex == playlist.mp3Files.length) {
      playlistIndex = 0;
    }
    $("#track").attr("src", playlist.mp3Files[playlistIndex]);
    audio.play();
    $("#play-icon").html("pause");
    $("#active_playlist").html(`${playlist.name}:${playlistIndex}`);
    playState = "pause";
  });
});
