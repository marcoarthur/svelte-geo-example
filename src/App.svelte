<script>
	import leaflet from 'leaflet';
	import PickAPlace from 'svelte-pick-a-place';
	import axios from 'axios';
	import List from './ReorderableList.svelte';
	let conf = window.__app_settings;
	let list = [];
	let selectionModes = ['polygon'];
	$: list;


	// Map callback
	const post_bbox = function (event) {

		if ( conf.debug ) {
			console.log('Data sent to Mojo');
			console.log(event.detail);
		}

		axios.post(conf.path.bbox, event.detail)
			.then( (res) =>  {
				if ( conf.debug ) {
					console.log('Data received from Mojo');
					console.log(res);
				}
				list = res.data.elements;
			} )
			.catch( (error) => { console.log(error) });
	}

</script>

<style>
	div.map-container {
		height: 100vh;
	}
</style>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
		crossorigin=""/>
</svelte:head>

<main>
	<div class="map-container">
		<PickAPlace {leaflet}
			{selectionModes}
			on:update={() => console.log('Update!')} 
			on:save={post_bbox}
		/>
		<div class="list-results">
			<List list={ list.map((r) => r.tags.name) }/>
		</div>
	</div>
</main>
