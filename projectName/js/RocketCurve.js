"use strict";

function RocketCurve(x0, x1, y0, y1, shape, logBase) {
	this.x0 = x0;
	this.x1 = x1;
	this.y0 = y0;
	this.y1 = y1;
	this.shape = shape;
	this.logBase = logBase;

	this.logBaseFactor = 1 / Math.log(this.logBase);
	this.coefficient = (this.y1 - this.y0) / (this.logBaseFactor * Math.log(((this.x1 - this.x0) + this.shape) / this.shape));
	
}

RocketCurve.prototype = Object.create(Object.prototype);
RocketCurve.prototype.constructor = RocketCurve;

RocketCurve.prototype.y = function(x) {
	return (this.coefficient * this.logBaseFactor * Math.log(((x - this.x0) + this.shape) / this.shape)) + this.y0;
};

/*
	Here's how I got the formula:

	We can get a logarithm with x = 0 and y = 0 and some control over the curve with:
	y = log_b(x + n) + m (m such that x = 0 -> y = 0)
	n controls the "curve" by offsetting x by n to move to a part of the log with a desired curve,
	and m offsets the y such that x = 0 -> y = 0

	Define m in terms of n so that it does that
	isolate m to get:
	m = -log_b(n)

	so the y = log_b(x + n) + m becomes:
	y = log_b(x + n) - log_b(n)
	y = log_b((x + n) / n)

	Okay, now let's make it so x = x0 -> y = y0:
	(y - y0) = log_b(((x - x0) + n) / n)
	y = log_b(((x - x0) + n) / n) + y0
	x and y are now offset such that x = x0 -> y = y0

	Now we need to determine an end point, x = x1 -> y = y1
	I will do this by putting a coefficient on the logarithm to scale the curve

	y = (a * log_b(((x - x0) + n) / n)) + y0, with a such that x = x1 -> y = y1

	So we find an a to make that happen by plugging in y1 and x1 and solving for a
	y1 = (a * log_b(((x1 - x0) + n) / n)) + y0
	y1 - y0 = a * log_b(((x1 - x0) + n) / n)
	a = (y1 - y0) / log_b(((x1 - x0) + n) / n)
	I'm not going to write the equation with that definition of a because that would just look silly

	Now we have the equation:
	y = (a * log_b(((x - x0) + n) / n)) + y0
	that lets us define a start and end point (with x0, y0, x1, y1) and control the shape of the curve (with n, b)


	In this object, n is "shape," b is "logBase," and a is "coefficient"
*/