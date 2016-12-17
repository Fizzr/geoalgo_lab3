function Node(parent, div)
{
	this.div = div;
	this.parent = parent;
	this.leftChild;
	this.rightChild;
	this.totNumbers = 0;
	this.maxWeight = 0;
	this.x;
	this.y;
}
function Leaf(parent, data)
{
	this.data = data;
	this.parent = parent;
	this.totNumbers = 1;
	this.maxWeight = Math.round(Math.abs(Math.sin(data))*100000)/1000;
	this.x;
	this.y;
}

function buildTree(parent, list)
{
	let thisNode;
	if(list.length == 0)
		console.log("SHIT FAM!");
	if(list.length == 1)
		thisNode = new Leaf(parent, list[0]);
	else
	{

		const divIndex = Math.floor((list.length-1)/2);
		const div = list[divIndex];
		thisNode = new Node(parent, div);
		thisNode.leftChild = buildTree(thisNode, list.slice(0, divIndex+1));
		thisNode.rightChild = buildTree(thisNode, list.slice(divIndex+1, list.length));
		thisNode.maxWeight = (thisNode.rightChild.maxWeight > thisNode.leftChild.maxWeight ? thisNode.rightChild.maxWeight: thisNode.leftChild.maxWeight);
		thisNode.totNumbers = thisNode.leftChild.totNumbers + thisNode.rightChild.totNumbers;
	}
	return thisNode;
}

function findSplit(tree, small, big)
{
	if(!(tree.totNumbers == 1) && (small > tree.div || big <= tree.div))
	{
		if(big <= tree.div)
			return findSplit(tree.leftChild, small, big);
		else
			return findSplit(tree.rightChild, small, big);
	}
	else
		return tree;
}

function takeAll(tree)
{
	let list = [];
	if(tree.totNumbers == 1)
		list.push(tree.data);
	else
	{
		list = list.concat(takeAll(tree.leftChild));
		list = list.concat(takeAll(tree.rightChild));
	}
	return list;
}
function search (tree, x, left)
{
	let list = [];
	if(tree.totNumbers == 1)
	{
		if(left)        //Will never be reached while going left...
		{
			if (tree.data >= x)
				list.push(tree.data);
		}
		else
		if(tree.data <= x)
			list.push(tree.data);
	}
	else
	{
		if(!left)
		{
			if(tree.div == x)
				list = list.concat(takeAll(tree.leftChild));
			else if(tree.div < x)
			{
				list = list.concat(takeAll(tree.leftChild));
				list = list.concat(search(tree.rightChild, x, left));
			}
			else
				list = list.concat(search(tree.leftChild, x, left));
		}
		else
		{
			if(tree.div == x)
			{
				list.push(x);
				list = list.concat(takeAll(tree.rightChild));
			}
			else if(tree.div < x)
				list = list.concat(search(tree.rightChild, x, left));
			else
			{
				list = list.concat(search(tree.leftChild, x, left));
				list = list.concat(takeAll(tree.rightChild, x, left));
			}
		}
	}
	//console.log(list);
	return list;
}

function OneDRangeQuery(tree, small, big)
{
	const split = findSplit(tree, small, big);
	let res = [];
	if (split.totNumbers == 1)
	{
		if(split.data == small)
			res.push(small);
		else if(split.data == big)
			res.push(big);
	}
	else
	{
		res = res.concat(search(split.leftChild, small, true));
		res = res.concat(search(split.rightChild, big, false));
	}
	return res;
}

function takeAllNum(tree)
{
	return tree.totNumbers;
}

function numberSearch (tree, x, left)
{
	let num = 0;
	if(tree.totNumbers == 1)
	{
		if (left)
		{
			if(tree.data >= x)
				num++;
		}
		else
		{
			if (tree.data <= x)
				num++;
		}
	}
	else
	{
		if(left)
		{
			if(tree.div == x)
			{
				num ++; //x is alone on left side
				num += takeAllNum(tree.rightChild); //take all on right
			}
			else if (tree.div < x)
			{
				num += numberSearch(tree.rightChild, x, left); //search right
			}
			else
			{
				num += numberSearch(tree.leftChild, x, left);
				num += takeAllNum(tree.rightChild);  //take all right
			}
		}
		else
		{
			if(tree.div == x)
			{
				num += takeAllNum(tree.leftChild); //x is biggest node on left branch
			}
			else if (tree.div < x)
			{
				num += takeAllNum(tree.leftChild);
				num += numberSearch(tree.rightChild, x, left);
			}
			else
			{
				num += numberSearch(tree.leftChild, x, left)
			}
		}
	}
	return num;
}

function numberInRange(tree, small, big)
{
	let res = 0;
	const split = findSplit(tree, small, big);

	if(split.totNumbers == 1)
	{
		if(split.data == small || split.data == big)
			res ++;
	}
	else
	{
		res += numberSearch(split.leftChild, small, true);
		res += numberSearch(split.rightChild, big, false);
	}
	return res;
}

function weightSearch(tree, x, left)
{
	if(tree.totNumbers == 1)
	{
		if(left)
		{
			if(tree.data >= x)
				return tree.maxWeight;
			else
				return 0;
		}
		else
		{
			if(tree.data <= x)
				return tree.maxWeight;
			else
				return 0;
		}
	}
	else
	{
		let leftWeight;
		let rightWeight;
		if(left)
		{
			if(x <= tree.div)
			{
				leftWeight = weightSearch(tree.leftChild, x, left);
				rightWeight = tree.rightChild.maxWeight;
			}
			else
				return weightSearch(tree.rightChild, x, left);
		}
		else
		{
			if(x == tree.div)
			{
				return tree.leftChild.maxWeight;
			}
			else if(x < tree.div)
			{
				return weightSearch(tree.leftChild, x, left);
			}
			else
			{
				leftWeight = tree.leftChild.maxWeight;
				rightWeight = weightSearch(tree.rightChild, x, left);
			}
		}
		if(leftWeight > rightWeight)
			return leftWeight;
		else
			return rightWeight;
	}
}
function weightInRange(tree, small, big, drawing)
{
	const split = findSplit(tree, small, big);
	if (split.totNumbers == 1)
	{
		if(split.data >= small && split.data <= big)
			return split.maxWeight;
	}
	else
	{
		const left = weightSearch(split.leftChild, small, true, drawing);
		const right = weightSearch(split.rightChild, big, false, drawing);
		if(left > right)
			return left;
		else
			return right;
	}
}
function test (len, start, least, most, small, big)
{
	let lastNum = start;
	let list = [];
	let ans = [];
	let bigWeight = 0;
	for (let i = 0; i < len; i++)
	{
		const random = lastNum + least + Math.floor(Math.random()*(most-least));
		lastNum = random;
		list.push(random);
		if(random >= small && random <= big)
		{
			ans.push(random);
			const weight = Math.round(Math.abs(Math.sin(random)) * 100000) / 1000;
			if(weight > bigWeight)
				bigWeight = weight;

		}
	}
	if(bigWeight == 0)
		bigWeight = undefined;
	const tree = buildTree(null, list);
	const treeAns = OneDRangeQuery(tree, small, big);
	const treeNum = numberInRange(tree, small, big, false);
	const treeWeight = weightInRange(tree, small, big, false);
	let correct = true;
	for (let i = 0; i < treeAns.length && correct; i++)
	{
		if(ans[i] != treeAns[i])
			correct = false;
	}
	let lengthBool = (treeNum == ans.length);
	let weightBool = (treeWeight == bigWeight);
	if(!(correct && lengthBool && weightBool))
	{
		console.log(small + " - "+ big);
		console.log(correct);
		console.log(lengthBool);
		console.log(weightBool);
		console.log(ans);
		console.log(treeAns);
		console.log(ans.length);
		console.log(treeNum);
		console.log(bigWeight);
		console.log(treeWeight);
	}

	return (correct && lengthBool && weightBool);
}