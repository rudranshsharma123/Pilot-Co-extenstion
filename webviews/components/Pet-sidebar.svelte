<script>
    import { onMount } from "svelte";
    // import { apiData, drinkNames } from './store.js';
    import { apiData, petimg } from './pet.js';
    let data1 = [];
    let img = [];
    let x = [];
    onMount(async () => {
      fetch("https://server.rudranshsharma3.repl.co/pets")
      .then(response => response.json())
      .then(data => {
            
            data1 = data;
            img = Object.values(data1);
            apiData.set(data);
            console.log('hello');
            console.log();
            x = Object.values(img[0]);
            console.log(typeof x);
        // apiData.set(data);
      }).catch(error => {
        console.log(error);
        return [];
      });
      
    });
    </script>
   
    {#each x as img }
    <img src = {img} alt = "pet">
        
    {/each}

  