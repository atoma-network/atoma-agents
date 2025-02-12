import Tools from '../utils/tools';
import AfterMath from '../protocols/aftermath/tools';
import Navi from '../protocols/navi/tools';
import Cetus from '../protocols/cetus/tools';
import Transaction from '../transactions/tools';
import Suilend from '../protocols/suilend/tools';
/* 
format for tool registry is:
tool name, tool description, tool arguments, process(function)
*/

export function registerAllTools(tools: Tools) {
  //after math tools
  AfterMath.registerTools(tools);
  //navi tools
  Navi.registerTools(tools);
  // Cetus tools
  Cetus.registerTools(tools);
  // Transaction Tools
  Transaction.registerTools(tools);
  // Suilend tools
  Suilend.registerTools(tools);
}
