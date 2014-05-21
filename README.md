Maps3D
========
Maps3D is a web-app to calculate the 3D-model of *any* place on earth. It allows you to define a rectangular area on a Google Map. The topography is then calculated and rendered as a rotateable, zoomable wireframe model.

![Maps3D Teaser]
(http://www.tiefenauer.info/wp-content/uploads/2014/05/957.png)

You can try out the current state [here][web-app]

If you like the App, drop be a line on [my blog][blog]

## Why is it awesome?
Because it uses your computer’s graphic card to render the 3D-Model. And of course because I made it (or I will make it, that is).

## What can I do with it?
A lotof things, amongst others you can…

* define a rectangular map extract to calculate the profile for
* set the precision of the profile (i.e. how many points the elevation will be retrieved)
* rotate/zoom the profile

##What can’t I do with it?
Awesome as it may be, there are some things you cannot do with Maps3D. For example, you cannot…

* define shapes other than rectangular to define the map extract (may be a feature for an upcoming release)
* show points on the map
* print the model on a 3D-Printer
* use the app as a flight simulator

## Why this project?
Counter question: Why not? Well, the original reason I made this was that I had to do SOMETHING as a school project. Since I was free to choose and I wanted to learn WebGL, I invented my own project topic.

## What technologies did you use?
Here’s the tech-stack:

* Framework: Backbone.js + Underscore.js
* Dependency Management: Require.js
* Unit Testing: QUnit, Sinon.js
* WebGL: Three.js
* UI: jQuery, jQuery UI, Twitter Bootstrap

## Wouldn’t it be even more awesome, if… ?
There are a lot of extensions to add, for example:

* Allowing the user to define areas with various shapes (circle, triangle, free-form, …)
* Caching the elevation data on some sort of backend (to reduce the calls made to the API. If the app gets used heavily enough, I might eventually end up with the full elevation data from Google :-) )
* Exporting the Data to other formats
* Saving the meshes
* Allowing elevation data input other than Google
* Texturing with Satellite images
* Simulating avalanches or having a 3D-Model of Godzilla walk over the area and destroy things :-)
* …

Feel free to fork from my repo :-)

## OK enough dirty details! I agree it’s awesome!
Told you so! :)

[web-app]:http://maps3d.tiefenauer.info
[blog]:http://www.tiefenauer.info/?page_id=24
