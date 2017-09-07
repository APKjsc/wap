<div projects="projects" ng-controller="design" class="projects screen">
	<div class="projectList">
		<p class="heading">we worked on...</p>
		<div ng-repeat="project in projects" class="projectOuter animate-list">
			<div ng-mouseover="$parent.viewproject=$index" class="project">
				<a ng-href="{{project.url}}" target="blank">
					<div style="background-image:url({{project.img[0].url}})" class="projectTile"></div>{{project.title}}</a>
			</div>
		</div>
	</div>
	<div ng-repeat="project in projects" ng-show="$index==viewproject" class="singleproject animate-projects">
		<div class="projectImage">
			<a ng-href="{{project.url}}" target="blank">
				<img ng-src="{{project.img[0].url}}" ng-show="project.img[0].url" alt="address: {{project.description}}" class="largeImage" />
				<img ng-src="{{project.iphone[0].url}}" ng-show="project.iphone[0].url &amp;&amp; $index==viewproject" alt="address: {{project.description}}" class="phone" />
			</a>
		</div>
		{{viewproject.description}}
	</div>
</div>