import Tools from '../utils/tools';
import AfterMath from '../protocols/aftermath/tools';
import Navi from '../protocols/navi/tools';
import Cetus from '../protocols/cetus/tools';
import Suilend from '../protocols/suilend/tools';
import TransactionTools from '../transactions/tools';
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
  TransactionTools.registerTools(tools);
  // Suilend tools
  Suilend.registerTools(tools);
}
