<style>
  .cn {
    font-family: Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
  }
  .marquee {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    animation: marquee 8s linear infinite;
  }
  .marquee span {
    font-size: 3rem;
    font-weight: bold;
    color: #ff6600;
    text-transform: uppercase;
  }
  @keyframes marquee {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
</style>


<template>

    <div class="cn">
        <div class="marquee">
    <span><slot></slot></span>
  </div>

    </div>
    
</template>