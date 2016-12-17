importScripts("TreeFile.js");

onmessage = function (e)
{
	const num = e.data[0];
	const min = e.data[1];
	const max = e.data[2];
	let truths = 0;
	let falses = 0;

	for (let i = 0; i < num; i++)
	{
		const len = min + Math.floor(Math.random() * (max-min));
		const least = 1;
		const most = least + Math.floor(Math.random() * len/10);
		const small = Math.floor(Math.random() * len);
		const big = small + Math.ceil(Math.random() * len);
		const res =test(len,Math.floor(Math.random()*len), least, most, small, big);
		if(res)
			truths++;
		else
		{
			falses++;
		}
		self.postMessage([truths, falses]);
	}
};