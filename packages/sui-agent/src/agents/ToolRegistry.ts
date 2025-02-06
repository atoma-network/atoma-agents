import Tools from '../utils/tools';
import AfterMath from '../protocols/aftermath/tools';
import Navi from '../protocols/navi/tools';
import Transaction from '../transactions/tools';
/* 
format for tool registry is:
tool name, tool description, tool arguments, process(function)
*/

export function registerAllTools(tools: Tools) {
  //after math tools
  AfterMath.registerTools(tools);
  //navi tools
  Navi.registerTools(tools);
  // Transaction Tools
  Transaction.registerTools(tools);
}
