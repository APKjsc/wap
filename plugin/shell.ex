<div ng-controller="about">
	<div ng-class="{'scroll': page=='about'}" class="aboutOuter">
		<div class="about">
			<div abouts="abouts" ng-class="{'hide': page!='about'}" class="aboutInner">
				<p>WE is a team based in HCMC.</p>
				<p>We are a diverse team of artists, designers, and developers dedicated to facilitating a deeper relationship between culture and technology through critical analysis and innovation.</p>
				<p class="twitter"></p>
				<p>WE is available for creative and technical consulting to agencies, brands and individuals.</p>
				<div class="social desktop"><a href="mailto:{{Mailto}}" target="blank"><i class="i i-envelope"><h2>email </h2></i></a><a href="https://www.facebook.com/search/pages/?q={{Socials}}" target="blank"><i class="i i-facebook"><h2>facebook </h2></i></a><a href="https://twitter.com/{{Socials}}" target="blank"><i class="i i-twitter"><h2>twitter </h2></i></a><a instagram="instagram" href="!" ng-click="Instagram()"><i class="i i-About"><h2>instagram </h2></i></a>
				</div>
			</div>
		</div>
	</div>
	<div ng-class="{'visible': page=='about'}" class="glowBar"></div>
</div>