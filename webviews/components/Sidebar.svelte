<script lang="ts">
import { onMount } from "svelte";


let todos = [];


// let todos: Array<{ text: string; completed: boolean}> = [];
    let text = '';
    
    onMount(
        ()=>{
            window.addEventListener("message", (event)=>{
                const message = event.data;
                switch(message.type){
                    case "new-todo":
                        todos = [{text:message.value, completed: false}, ...todos];
                        break;
                }
            })
        }
    )
</script>



<style>
         

li {
  list-style: star;
  /* position: relative; */
  /* padding: 0 0 0 20px; */
}
    
  .complete{
      text-decoration : line-through;
  }
  /* tiny reset */


</style>

<h2>Welcome to the todolist</h2>
<h4>Start typing your todolists here
</h4>
<h4> Use single click to check/uncheck Item, Use double click to delete the item</h4>

<form 
 on:submit|preventDefault = {()=> {
     todos = [{text, completed : false}, ...todos];
     text = '';
 }}>
<input bind:value= {text}/>
</form>

<ul>
    {#each todos as todo   }
        <li class:complete= {todo.completed}
         
        on:dblclick={
               
            ()=>{
                todos = todos.filter(x => x !== todo);
            }
        
        }
        on:click={
            ()=>{
                todo.completed = !todo.completed;
            }
        
        }>
{todo.text}
</li>
    {/each}
    
</ul>

<!-- <button on:click={()=> {
    tsvscode.postMessage(
        {
            type: 'onInfo',
            value: 'info'
        }    )
}}>Click Me</button>
<button on:click={()=> {
    tsvscode.postMessage(
        {
            type : 'onError',
            value: 'error'
        }    )
}}></button> -->
