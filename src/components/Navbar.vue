<script setup lang="ts">

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-primary">
    <div class="container-fluid">
      <!-- Icon/title -->
      <a class="navbar-brand" href="#">
        <img src="/icon.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top me-2">
        GCS Editor
      </a>

      <!-- Toggle navbar -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>

      <!-- Navbar content -->
      <div id="navbarContent" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink active-class="active" class="nav-link" to="/">
              Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink active-class="active" class="nav-link" to="/tableeditor">
              Table Editor
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
