const timeout = 20000;

module.exports = {


	'Step 1: Open page at 800 x 800': function(browser){
		browser
			.url(browser.launch_url + "/overlay-with-arrow.html")
			.waitForElementVisible("button.o-overlay-trigger",timeout)
			.windowSize('current',800,800);
	},

	'Step 2: Test compact overlay with arrow loads' : function (browser) {
		browser
			.click("button.o-overlay-trigger")
			.waitForElementVisible(".o-overlay--compact",timeout)
			.assert.elementNotPresent(".o-overlay-shadow","Verified there is no overlay-shadow present")
			.assert.containsText(".o-overlay__content","Overlay content.")
			.isVisible(".o-overlay__content",function(result){
				this.assert.equal(result.value,true,"Overlay content is visible");
			})
			.isVisible(".o-overlay__close",function(result){
				this.assert.equal(result.value,true,"Overlay close button is visble");
			});

	},

	'Step 3: Test that the arrow is in the correct place': function(browser){
		let button_top;
		let button_bottom;
		let arrow_top;

		browser
			.isVisible(".o-overlay__arrow-top", function(result){
				this.assert.equal(result.value,true,"Overlay arrow appeared");
			})
			.getLocation(".o-overlay-trigger", function(location){
				button_top = location.value.y;
				this.getElementSize(".o-overlay-trigger", function(size){
					button_bottom = button_top + size.value.height;
				});
			})
			.getLocation(".o-overlay__arrow-top", function(location){
				arrow_top = location.value.y;
				this.assert.ok(arrow_top >= button_bottom, "Overlay with arrow appears below the trigger button");
			});
	},

	// Module should render in the middle of the page.  Since we know this browser is set
	// to 800 px wide, we're only testing that it appears within the boundaries of the
	// middle third of the page.
	'Step 4: Check overlay placement' : function (browser) {
		const window_width = 800;
		const window_first_third = window_width/3;
		const window_second_third = window_first_third*2;
		let overlay_left;
		let overlay_right;

		browser
			.getLocation(".o-overlay--compact", function(location){
				overlay_left = location.value.x;
			})
			.getElementSize(".o-overlay--compact", function(size){
				overlay_right = overlay_left + size.value.width;
				this.assert.ok(overlay_left>window_first_third, "Left side of overlay appears centered on the page");
				this.assert.ok(overlay_right<window_second_third, "Right side of overlay appears centered on the page");
			});
	},

	'Step 5: Close the overlay': function(browser){
		browser
			.click(".o-overlay__close")
			.assert.elementNotPresent("o-overlay--modal","Overlay closed, as expected")
			.end();
	}
};
